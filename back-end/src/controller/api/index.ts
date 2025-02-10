import express from "express";
import https from "https";
import fs from "fs";
import path from "path";

import adminRouter from "./admin";
import tollStationPassesRouter from "./tollStationPasses";
import passAnalysisRouter from "./passAnalysis";
import passesCostRouter from "./passesCost";
import chargesByRouter from "./chargesBy";

const apiRouter = express.Router();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/tollStationPasses", tollStationPassesRouter);
apiRouter.use("/passAnalysis", passAnalysisRouter);
apiRouter.use("/passesCost", passesCostRouter);
apiRouter.use("/chargesBy", chargesByRouter);

// Create the Express app and mount the API router.
const app = express();
app.use("/api", apiRouter);

// Build absolute paths to the SSL key and certificate.
// Adjust the relative paths as needed based on the file's location in your container.
const keyPath = path.join(__dirname, "../../../SSL/key.pem");
const certPath = path.join(__dirname, "../../../SSL/cert.pem");

// Read the SSL certificate and key files.
const sslOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

// Set the port (use the environment variable PORT or default to 3000).
const port = process.env.PORT || 3000;

// Create and start the HTTPS server.
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS server is running on port ${port}`);
});

export default apiRouter;
