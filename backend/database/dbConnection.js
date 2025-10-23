import mongoose from "mongoose";

export function dbConnect() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(`Connection Error: ${err}`))
};