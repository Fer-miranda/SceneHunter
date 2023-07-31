
import React, { useState, useEffect} from "react";
import { useGetUserID, useGetUserName } from "../hooks/useGetUserId";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import './Form.css';
import { createLocation, updateLocation, getLocationById, getLocations } from "../services/location.services";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const sceneAddSuccess = () =>{
  toast.success("Added Scene 📷!")
}

const sceneAddFailure = () =>{
  toast.error("Please fill all data.")
}

const userNotLoggedIn = () =>{
  toast.warning("Register to hunt scenes! 👻")
}

export const Form = ({ location: initialLocation, locationId, lat, lon, fetchLocations }) => {
  const userID = useGetUserID();
  const userName = useGetUserName();
  const [cookies, _] = useCookies(["access_token"]);
  const [location, setLocation] = useState({
    id: locationId || "",
    name: "",
    category: "",
    description: "",
    userOwner: userID,
    userName: userName,
    image: "",
    lat: lat,
    lon: lon,
    ...initialLocation,
  });
  
  const [nameErrors, setNameErrors] = useState("");
  const [descriptionErrors, setDescriptionErrors] = useState("");
  const [fileError, setFileError] = useState("");

  const navigate = useNavigate();



  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocation({ ...location, [name]: value });
  };


  const handleImageChange = (event) => {
    const files = event.target.files;
    setLocation({ ...location, images: files });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
 
  try {
    if (!userID) {
      userNotLoggedIn();
      return;
    }

    if (location.name === "") {
      setNameErrors("Title is required");
      return;
    }
    if (location.name.length < 3) {
      setNameErrors("Title must be al least 3 characters");
      return;
    }
    if (location.description === "") {
      setDescriptionErrors("Description is required");
      return;
    }
    if (location.description.length < 5) {
      setDescriptionErrors("Description must have at least 5 characters");
      return;
    }
    if (!location.images || location.images.length < 1 || location.images.length > 3) {
      setFileError("Please select 1 to 3 files");
      return;
    }

    if (locationId && location.userOwner !== userID) {
      console.log("No tienes permisos para editar esta location.");
      return;
    }

    if (locationId) {
      await updateLocation(locationId, location, cookies.access_token);
    } else {
      await createLocation(location, cookies.access_token);
    }
    // alert("Location Created/Updated");

    console.log(locationId);
    navigate("/home");
    const response = await getLocations(); 
    fetchLocations(response.data); 
    sceneAddSuccess()
    // getLocationsFromService();
    // else{
    //   const response = !locationId
    //   ? await createLocation(location, cookies.access_token)
    //   : await updateLocation(locationId, location, cookies.access_token)
    //   alert("Location Created/Updated");
    //   console.log(response);
    // }
  } catch (error) {
    // sceneAddFailure();
    console.error(error);
    // setErrors(error.response.data.errors); //esto es nuevo
  }
};

// useEffect(() => {
//   const getLocationFromService = async () => {
//     try {
//       const response = await getLocationById(locationId);
//       const locationData = response.data;
//       setLocation(locationData);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (locationId) {
//     getLocationFromService();
//   }
// }, [locationId]);

    return (
    <div className="formulario">
      <h3>Hunt Scenes 📷</h3>
      <form onSubmit={handleSubmit} className="formulario_1">
        <label>Categoría</label>
        <select onChange={handleChange} value={location.category} id="category" name="category">
          {/* <option>Selecciona una categoría</option> */}
          <option value="" disabled>Select a Category</option>
          <option value="Movies">Movies</option>
          <option value="Music videos">Music videos</option>
          <option value="Series">Series</option>
        </select>
        
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ej: The Lord of the Rings"
          value={location.name}
          onChange={handleChange}
        />
        {nameErrors && (<span className="text-danger">{nameErrors}</span>)} 
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Say something about this place"
          name="description"
          value={location.description}
          onChange={handleChange}
        ></textarea>
        {descriptionErrors && (<span className="text-danger">{descriptionErrors}</span>)} 
        <label>Imagen</label>
        <input type="file" name="images" onChange={handleImageChange} multiple />
        {fileError && <span className="text-danger">{fileError}</span>}
        <button className="submit-button" type="submit">Hunt scene</button>
      </form>
    </div>
  );
};


