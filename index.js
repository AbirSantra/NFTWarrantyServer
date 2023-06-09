//! THIS IS THE ROOT OF THE SERVER //

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dontenv from "dotenv";
import corsOptions from "./config/corsOptions.js";
import connectDB from "./config/dbConnection.js";
import mongoose from "mongoose";
import UserRoutes from "./routes/userRoutes.js";
import ResumeRoutes from "./routes/resumeRoutes.js";
import AuthRoutes from "./routes/authRoutes.js";

//! INITIALIZE SERVER APP //
const app = express();
dontenv.config();
connectDB();

//! PORT //
const PORT = process.env.PORT || 5000;

//! MIDDLEWARES //
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cookieParser());

//! ROUTES //
app.use("/auth", AuthRoutes); //-> All routes related to authentication

app.use("/user", UserRoutes); //-> All routes related to users

//-> When no matching routes exist
app.all("*", (req, res) => {
	res.status(404);
	res.send("404 Error. No matching routes found!");
});

//! DATABASE CONNECTIONS //
mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => {
		console.log(`Server started on PORT: ${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
});
