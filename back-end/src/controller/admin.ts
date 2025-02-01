import express from "express";
import multer from "multer";
import { Readable } from "stream";

import config from "@utils/config";
import prisma from "@src/database/prismaClient";
import { csvPassesStreamToJson } from "@utils/csv_handlers";

const adminRouter = express.Router();
// Because we are using memory storage, the file will be stored in memory and not on disk
// and will be available only as a buffer. Buffer then has to be converted to a stream
// using ""
const upload = multer({ storage: multer.memoryStorage() })

adminRouter.get("/healthcheck", async (_, res) => {
  try {
    // Logic to get the n_stations, n_tags and n_passes

    res.json({
      status: "OK",
      dbconnection: config.DATABASE_URL,
      n_stations: 10,
      n_tags: 10,
      n_passes: 10,
    });
  } catch {
    res.status(401).json({
      status: "failed",
      dbconnection: config.DATABASE_URL,
    });
  }
});

adminRouter.post("/resetstations", async (req, res) => {
  res.json();
});

adminRouter.post("/resetpasses", async (req, res) => {
  res.json();
});

adminRouter.post("/addpasses", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    if (file.mimetype !== "text/csv") {
      res.status(400).json({ error: "Invalid file type. Only CSV files are allowed." });
      return;
    }

    const fileStream = Readable.from(file.buffer);
    const passes = await csvPassesStreamToJson(fileStream);

    // Use Prisma transaction to add all passes in a single transaction
    // This ensures that either all or none of the passes are added
    await prisma.$transaction(async (tx) => {
      await tx.pass.createMany({
        data: passes
      });
    },
      // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-options
      { maxWait: 5000, timeout: 10000 }
    );

    res.status(201).json({ message: `Passes successfully added` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error adding passes" });
  }
})


export default adminRouter;
