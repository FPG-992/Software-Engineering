import express from "express";
import https from "https";
import selfsigned from "selfsigned";
import cors from "cors";

import apiRouter from "./controller/api";
import config from "./utils/config";

const app = express();

// Enable CORS (adjust settings as needed)
app.use(cors({ origin: "*" }));

// Parse incoming JSON requests
app.use(express.json());

// Mount API routes
app.use("/api", apiRouter);

// A simple test route
app.get("/", (_req, res) => {
  res.send("Hello World");
});

// Generate a self-signed certificate valid for 365 days with a 2048-bit key.
// "localhost" is used as the common name.
const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 365, keySize: 2048 });

const sslOptions = {
  key: pems.private,
  cert: pems.cert,
};

// Use the port from config (or default to 9115)
const port = config.BACKEND_PORT || 9115;

// Start the HTTPS server using the generated certificate and key.
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS server is running on port ${port}`);
});

export default app;
