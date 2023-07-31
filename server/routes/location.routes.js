import express from "express";
import { getLocations, createLocation, getLocationById, saveLocation, getSavedLocationIds, getSavedLocations, updateLocation, deleteLocation, getUserLocations, likeLocation, getLocationLikes, getLikedLocations } from '../controller/location.controller.js'
import { verifyToken } from "./user.routes.js";

const locationsRouter = express.Router();

locationsRouter.get("/", getLocations);
locationsRouter.post("/", verifyToken, createLocation);
locationsRouter.get("/:locationId", getLocationById);
locationsRouter.put("/", saveLocation);
locationsRouter.get("/savedLocations/ids/:userId", getSavedLocationIds);
locationsRouter.get("/savedLocations/:userId", getSavedLocations);
locationsRouter.put("/:locationId", updateLocation);
locationsRouter.delete("/:locationId", deleteLocation);
locationsRouter.get("/userLocations/:userId", getUserLocations);
locationsRouter.post("/:locationId/like/:userId", verifyToken, likeLocation); //dar like
locationsRouter.get("/:locationId/likes", getLocationLikes); //obtener likes de las locations
locationsRouter.get("/likedLocations/:userId", getLikedLocations); //obtener las localizaciones a las que el usuario ha dado like


export default locationsRouter;
