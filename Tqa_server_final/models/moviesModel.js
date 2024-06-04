import mongoose from "mongoose";

const moviesSchema = mongoose.Schema({
    name: String,
    time: Number,
    year: Number,
    image: String,
    introduce: String,  
});

const moviesModel = mongoose.model("movies", moviesSchema);

export default moviesModel;
