import routes from "./routes/routes.js";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", routes);

const directory = "C:Users\\rculb\\OneDrive\\Desktop\\TheApronApp\\";

app.use(express.static(path.join(directory, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(directory, "client", "build", "index.html"));
});

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((err) => console.log(err));
