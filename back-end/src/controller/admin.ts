import express from "express";
import config from "@utils/config";

const adminRouter = express.Router();

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

adminRouter.post("/addpasses", async (req, res) => {
    res.json();
})
