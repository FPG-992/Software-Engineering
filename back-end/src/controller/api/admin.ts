import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Readable } from "node:stream";

import config from "@utils/config";
import prisma from "@src/database/prismaClient";
import {
	csvPassesStreamToJson,
	csvTollStationsStreamToJson,
} from "@utils/csv_handlers";
import { tagRefCount } from "@prisma/client/sql";

const adminRouter = express.Router();
// Using memory storage for file uploads (only used for /addpasses)
const upload = multer({ storage: multer.memoryStorage() });

adminRouter.get("/healthcheck", async (_, res) => {
	try {
		const tagRefCountQueryResult = await prisma.$queryRawTyped(tagRefCount());
		const n_stations = await prisma.tollStation.count();
		const n_tags = Number(tagRefCountQueryResult.at(0)?.count ?? 0);
		const n_passes = await prisma.pass.count();

		res.json({
			status: "OK",
			dbconnection: config.DATABASE_URL,
			n_stations,
			n_tags,
			n_passes,
		});
	} catch (e) {
		console.error("Error in /healthcheck:", e);
		res.status(401).json({
			status: "failed",
			dbconnection: config.DATABASE_URL,
		});
	}
});

// /admin/resetstations now reads from a local CSV file
adminRouter.post("/resetstations", async (req, res) => {
	try {
		// Use the global __dirname available in CommonJS
		const filePath = path.join(__dirname, "../../../data/tollstations2024.csv");
		if (!fs.existsSync(filePath)) {
			res.status(500).json({
				status: "failed",
				info: "Toll stations file not found at " + filePath,
			});
			return;
		}

		const fileStream = fs.createReadStream(filePath);
		const tollStations = await csvTollStationsStreamToJson(fileStream);

		// Prisma transaction to clear and reinitialize toll stations
		await prisma.$transaction(
			async (tx) => {
				await tx.tollStation.deleteMany();
				await tx.tollStation.createMany({
					data: tollStations,
				});
			},
			{ maxWait: 5000, timeout: 10000 }
		);

		res.status(200).json({ status: "OK" });
	} catch (e) {
		console.error("Error in /resetstations:", e);
		res.status(500).json({ status: "failed", info: "Error adding toll stations" });
	}
});

// /admin/resetpasses now only deletes passes (removing any reference to a non-existent tag model)
adminRouter.post("/resetpasses", async (req, res) => {
	try {
		await prisma.pass.deleteMany({});
		res.status(200).json({ status: "OK" });
	} catch (e) {
		console.error("Error in /resetpasses:", e);
		res.status(500).json({ status: "failed", info: "Error resetting passes" });
	}
});

// /admin/addpasses endpoint expects a CSV upload
adminRouter.post("/addpasses", upload.single("file"), async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			res.status(400).json({ status: "failed", info: "No file uploaded" });
			return;
		}

		if (file.mimetype !== "text/csv") {
			res.status(400).json({
				status: "failed",
				info: "Invalid file type. Only CSV files are allowed.",
			});
			return;
		}

		const fileStream = Readable.from(file.buffer);
		const passes = await csvPassesStreamToJson(fileStream);

		await prisma.$transaction(
			async (tx) => {
				await tx.pass.createMany({
					data: passes,
				});
			},
			{ maxWait: 5000, timeout: 10000 }
		);

		res.status(200).json({ status: "OK" });
	} catch (e) {
		console.error("Error in /addpasses:", e);
		res.status(500).json({ status: "failed", info: "Error adding passes" });
	}
});

export default adminRouter;