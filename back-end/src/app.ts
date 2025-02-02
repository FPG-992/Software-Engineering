import express from "express";
import cors from "cors";

import apiRouter from "@src/controller/api";
import logger from "@utils/logger";

import "express-async-errors"; // Import this before other routes



import config from "./utils/config";


export const app = express();

// Cross Origin Resource Sharing
app.use(
    cors({
        origin: "*", // Allow all origins
    }),
);

/*  The json-parser takes the JSON data of a request, transforms it into
a JavaScript object and then attaches it to the body property of the request
object before the route handler is called. */
app.use(express.json());

app.use("/api", apiRouter);