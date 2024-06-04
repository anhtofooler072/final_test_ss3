import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import data from "./Data/testData.json" assert { type: "json" };
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moviesModel from "./models/moviesModel.js";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

await mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

/**------------------------------------------------------------------------
 *                           API for movies
 *------------------------------------------------------------------------**/
// insert data to MongoDB
app.get("/insertdata", async (req, res) => {
  await moviesModel.insertMany(data);
  res.send("Data inserted");
});

// add new movie
app.post("/addmovie", async (req, res) => {
  const newMovie = req.body;
  await moviesModel.create(newMovie);
  res.send("Movie added");
});

// delete movde
app.delete("/deletemovie/:id", async (req, res) => {
  const id = req.params.id;
  await moviesModel.findByIdAndDelete(id);
  res.send("Movie deleted");
});

// update movie
app.put("/updatemovie/:id", async (req, res) => {
  const id = req.params.id;
  const updatedMovie = req.body;
  await moviesModel.findByIdAndUpdate(id, updatedMovie);
  res.send("Movie updated");
});

// sort ascending and descending by year through query
// example: /sortmovie?sort=1 or /sortmovie?sort=-1
app.get("/sortmovie", async (req, res) => {
  try {
    const sort = req.query.sort;
    // console.log(typeof sort); // check type of sort
    const movies = await moviesModel.find().sort({ year: Number(sort) });
    res.send(movies);
  } catch (error) {
    res.send(error);
  }
});

// finding movie using regex
app.get("/findmovie/:name", async (req, res) => {
  const name = req.params.name;
  const movies = await moviesModel.find({
    name: { $regex: name, $options: "i" },
  });
  res.send(movies);
});

/**------------------------------------------------------------------------------------------------
 *                                         API for users
 *------------------------------------------------------------------------------------------------**/
//register
app.post("/user/register", async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = { name, email, password: hashedPassword, salt };
  await userModel.create(newUser);
  res.send("User registered");
});

//login
app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.send("User not found");
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET);
      res.send(token);
    } else {
      res.send("Wrong password");
    }
  }
});

// login with token
app.post("/user/loginwithtoken", async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) return res.status(401).send("Access Denied");
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    // req.user = verified;
    console.log(verified); // testing purpose
    res.send(verified);
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
