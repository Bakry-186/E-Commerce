import mongoose from "mongoose";

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URL);

// Event listener to confirm successful connection
mongoose.connection.on("connected", () => {
  console.log("connected to DB");
});
