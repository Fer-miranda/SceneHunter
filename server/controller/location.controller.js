import multer from 'multer';
import mongoose from "mongoose";
import { LocationModel } from "../model/location.model.js";
import { UserModel } from "../model/user.model.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // La carpeta donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});

const upload = multer({ storage: storage });

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const result = await LocationModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};


export const createLocation = async (req, res) => {
  // ...
  try {
    // Aquí utilizamos Multer para cargar la imagen
    upload.array('images', 3)(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al cargar la imagen',
          error: err,
        });
      }

      // Creación del nuevo locationo
      const location = new LocationModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        lat: req.body.lat,
        lon: req.body.lon,
        userOwner: req.body.userOwner,
        userName: req.body.userName,
        // image: req.file ? req.file.path.replace("uploads\\", "") : '', // Guarda la ruta del archivo en el campo image
        images: req.files ? req.files.map(file => file.path.replace("uploads\\", "")) : [], // Save an array of image paths
        
      });

      try {
        const result = await location.save();
        res.status(201).json({
          createdLocation: {
            name: result.name,
            category: result.category,
            description: result.description,
            lat: result.lat,
            lon: result.lon,
            _id: result._id,
          },
        });
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'No hemos podido crear un nuevo locationo',
      error: err,
      
    });
  }
};

// Get a location by ID
export const getLocationById = async (req, res) => {
  try {
    const result = await LocationModel.findById(req.params.locationId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Save a location
export const saveLocation = async (req, res) => {
  const location = await LocationModel.findById(req.body.locationID);
  const user = await UserModel.findById(req.body.userID);

  try {
    user.savedLocations.push(location);
    await user.save();
    res.status(201).json({ savedLocations: user.savedLocations });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get IDs of saved locations
export const getSavedLocationIds = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedLocations: user?.savedLocations });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// Get saved locations
export const getSavedLocations = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedLocations = await LocationModel.find({
      _id: { $in: user.savedLocations },
    });

    console.log(savedLocations);
    res.status(201).json({ savedLocations });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const updateLocation = async (req, res) => {
  const { locationId } = req.params;

  try {
    // Aquí también utilizamos Multer para cargar la imagen
    upload.array('images', 3)(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al cargar la imagen',
          error: err,
        });
      }

      try {
        const updatedLocation = await LocationModel.findByIdAndUpdate(
          locationId,
          {
            ...req.body,
            // image: req.file ? req.file.path.replace("uploads\\", "") : '', // Guarda la ruta del archivo en el campo image
            images: req.files ? req.files.map(file => file.path.replace("uploads\\", "")) : [],
          },
          { new: true }
        );
        res.status(200).json(updatedLocation);
      } catch (err) {
        res.status(500).json(err);
        console.log(err)
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'No hemos podido actualizar el locationo',
      error: err,
    });
  }
};


export const deleteLocation = async (req, res) => {
  const { locationId } = req.params;

  try {
    await LocationModel.findByIdAndDelete(locationId);
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUserLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    const userLocations = await LocationModel.find({ userOwner: userId });
    res.status(200).json(userLocations);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const likeLocation = async (req, res) => {
  try {
    const { locationId, userId } = req.params;

    // Verificar si la ubicación y el usuario existen
    const location = await LocationModel.findById(locationId);
    const user = await UserModel.findById(userId);

    if (!location || !user) {
      return res.status(404).json({ message: 'Ubicación o usuario no encontrado' });
    }

    // Verificar si el usuario ya ha dado "like" a la ubicación
    if (location.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'El usuario ya ha dado like a esta ubicación' });
    }

    // Actualizar la ubicación y el usuario con el "like"
    location.likes += 1;
    location.likedBy.push(userId);
    user.likedLocations.push(locationId);

    // Guardar los cambios en la base de datos
    await location.save();
    await user.save();

    res.status(200).json({ message: 'Like agregado exitosamente' });
  } catch (err) {
    res.status(500).json(err);
  }
};


export const getLocationLikes = async (req, res) => {
  try {
    const { locationId } = req.params;

    // Verificar si la ubicación existe
    const location = await LocationModel.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }

    res.status(200).json({ likes: location.likes });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get locations liked by user
export const getLikedLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    const likedLocations = await LocationModel.find({
      _id: { $in: user.likedLocations },
    });

    res.status(200).json({ likedLocations });
  } catch (err) {
    res.status(500).json(err);
  }
};
