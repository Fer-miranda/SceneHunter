import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.routes.js";
import productsRouter from "./routes/location.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/api/locations", productsRouter);
app.use('/img', express.static('uploads'));

mongoose.connect('mongodb://127.0.0.1/sceneHunter_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('We are making some connections!'))
    .catch(err => console.log('Somenthing went wrong', err));


app.listen(3001, () => console.log("Server started"));
