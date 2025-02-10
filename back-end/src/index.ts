import express from "express";
import https from "https";
import selfsigned from "selfsigned";
import cors from "cors";
import fs from "fs";
import path from "path";

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

// Define the SSL directory and certificate file paths
const sslDir = path.join(__dirname, "SSL");
const keyPath = path.join(sslDir, "key.pem");
const certPath = path.join(sslDir, "cert.pem");

// Create the SSL directory if it doesn't exist
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

// If the certificate files are missing, generate and save them
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  const attrs = [{ name: "commonName", value: "localhost" }];
  const pems = selfsigned.generate(attrs, { days: 365, keySize: 2048 });
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);
}

// Read the certificate files
const sslOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

const port = config.BACKEND_PORT || 9115;

// Start the HTTPS server using the certificate files
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS server is running on port ${port}`);
});

export default app;
