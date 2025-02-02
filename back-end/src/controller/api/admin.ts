import express from "express";
import multer from "multer";

import config from "@utils/config";
import prisma from "@src/database/prismaClient";
import {
	csvPassesStreamToJson,
	csvTollStationsStreamToJson,
} from "@utils/csv_handlers";
import { ReadStream } from "node:fs";
import { Readable } from "node:stream";

const adminRouter = express.Router();
// Because we are using memory storage, the file will be stored in memory and not on disk
// and will be available only as a buffer. Buffer then has to be converted to a stream
// using ""
const upload = multer({ storage: multer.memoryStorage() });

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

adminRouter.post("/resetstations", upload.single("file"), async (req, res) => {
	try {
		// The attribute name in the request body must match the form field name
		// in upload.single("file"), which is "file"
		const file = req.file;
		if (!file) {
			res.status(400).json({ status: "failed", reason: "No file uploaded" });
			return;
		}

		if (file.mimetype !== "text/csv") {
			res.status(400).json({
				status: "failed",
				reason: "Invalid file type. Only CSV files are allowed.",
			});
			return;
		}

		const fileStream = Readable.from(file.buffer);
		const tollStations = await csvTollStationsStreamToJson(fileStream);

		// Use Prisma transaction to add all toll stations in a single transaction
		// This ensures that either all or none of the passes are added
		await prisma.$transaction(
			async (tx) => {
				await tx.tollStation.createMany({
					data: tollStations,
				});
			},
			// https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-options
			{ maxWait: 5000, timeout: 10000 },
		);

		res.status(201).json({ status: "OK" });
	} catch (e) {
		console.log(e);
		res
			.status(500)
			.json({ status: "failed", reason: "Error adding toll stations" });
	}
});

adminRouter.post("/resetpasses", async (req, res) => {
	res.json();
});

adminRouter.post("/addpasses", upload.single("file"), async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			res.status(400).json({ status: "failed", reason: "No file uploaded" });
			return;
		}

		if (file.mimetype !== "text/csv") {
			res.status(400).json({
				status: "failed",
				reason: "Invalid file type. Only CSV files are allowed.",
			});
			return;
		}

		const fileStream = Readable.from(file.buffer);
		const passes = await csvPassesStreamToJson(fileStream);

		// Use Prisma transaction to add all passes in a single transaction
		// This ensures that either all or none of the passes are added
		await prisma.$transaction(
			async (tx) => {
				await tx.pass.createMany({
					data: passes,
				});
			},
			// https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-options
			{ maxWait: 5000, timeout: 10000 },
		);

		res.status(201).json({ status: "OK" });
	} catch (e) {
		res.status(500).json({ status: "failed", reason: "Error adding passes" });
	}
});

export default adminRouter;
