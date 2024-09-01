import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer'; //Middleware for handling multipart/form-data, used for file uploads
import helmet from 'helmet'; //Middleware to secure HTTP headers by setting various HTTP headers
import morgan from 'morgan'; //HTTP request logger middleware for Node.js
import path from 'path'; //Provides utilities for working with file and directory paths
import { fileURLToPath } from 'url'; //Converts a file URL to a path, used to handle module paths
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { createPost } from './controllers/posts.js';
import { register } from "./controllers/auth.js";
import { verifyToken } from './middleware/auth.js';
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from './data/index.js';

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url); //Gets the path of the current module file
const __dirname = path.dirname(__filename); //Gets the directory name of the current module file
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //Allows resources to be shared across origins
app.use(cors());
app.use(morgan('common')); //Logs HTTP requests in a common format
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes)
app.use('/posts', postRoutes);

// This route can't be added to the authRoute file since it needs upload functionality right above
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* DATABASE CONNECTION */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);

    });
}).catch((error) => {
    console.log(error.message || "Server failed to start");
});

