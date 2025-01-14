import express from "express";
import cors from "cors";

import "express-async-errors"; // Import this before other routes



import config from "./utils/config";

const app = express();

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


app.get("/", async (_req, res) => {
	res.send("Hello World");
});


app.listen(config.BACKEND_PORT, () => {
	console.log(`Server is running on port ${config.BACKEND_PORT}`);
});