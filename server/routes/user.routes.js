import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../model/user.model.js";



// router.post("/register", async (req, res) => {
//     try {
//       const { userName, email, password } = req.body;
//       const user = await UserModel.findOne({ userName });
//       if (user) {
//         return res.status(400).json({ message: "Username already exists" });
        
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new UserModel({ userName, email, password: hashedPassword });
//       await newUser.save();
//       res.json({ message: "User registered successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "An error occurred during registration", error: error.message });
//       console.log(error)
//     }
//   });



// router.post("/register", async (req, res) => {
//   try {
//     const { userName, email, password } = req.body;
//     const newUser = new UserModel({ userName, email, password });

//     // Validar el modelo antes de guardarlo
//     const validationError = newUser.validateSync();
//     if (validationError) {
//       const errors = Object.values(validationError.errors).map((error) => error.message);
//       return res.status(400).json({ errors });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     newUser.password = hashedPassword;
//     await newUser.save();
//     res.json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred during registration", error: error.message });
//     console.log(error);
//   }
// });
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const newUser = new UserModel({ userName, email, password });

    // Validar el modelo antes de guardarlo
    await newUser.validate();

    const existingUser = await UserModel.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      const errors = [];
      if (existingUser.userName === userName) {
        errors.push("Username already exists");
      }
      if (existingUser.email === email) {
        errors.push("Email already exists");
      }
      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    const errors = Object.values(error.errors).map((error) => error.message);
    res.status(400).json({ errors });
    console.log(error);
  }
});


router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const user = await UserModel.findOne({ userName });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id, userName: user.userName });
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
