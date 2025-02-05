import express from "express";
import { parse, format, isValid, interval } from "date-fns";
import multer from "multer";

import config from "@utils/config";
import prisma from "@src/database/prismaClient";

import { tollStationPassesQuery } from "@prisma/client/sql";
import { paramDateFormat, responseDateFormat } from "@utils/constants";
import { Prisma } from "@prisma/client";

const tollStationPassesRouter = express.Router();

tollStationPassesRouter.get(
	"/:tollStationID/:date_from/:date_to",
	async (req, res) => {
		try {
			const { tollStationID, date_from, date_to } = req.params;

			// Parse the date_from and date_to parameters
			const dateFrom = parse(date_from, paramDateFormat, new Date());
			const dateTo = parse(date_to, paramDateFormat, new Date());
            // The dateTo parameter is exclusive, so we need to add one day to it
            // example: if dateFrom=20220101 and dateTo=20220102, the query will return
            // all passes from "20220101 00:00:00" to "20220101 23:59:59" excluding "20220102 00:00:00"
            dateTo.setDate(dateTo.getDate() + 1);

			// If the date parameters are invalid, return a 400 response
			if (!isValid(dateFrom) || !isValid(dateTo)) {
				res.status(400).json({
					status: "failed",
					reason: "Invalid date format, expected: yyyyMMdd",
				});
				return;
			}

			// Get the toll station and its passes
			// If the toll station does not exist, the query will throw an error
			const [tollStationResult, tollStationPassesResult] =
				await prisma.$transaction([
					prisma.tollStation.findUniqueOrThrow({
						where: { TollID: tollStationID },
					}),
					prisma.$queryRawTyped(
						tollStationPassesQuery(tollStationID, dateFrom, dateTo),
					),
				]);

			// Return the toll station and its passes
			res.status(200).json({
				stationID: tollStationResult.TollID,
				stationOperator: tollStationResult.Operator,
				requestTimestamp: format(new Date(Date.now()), responseDateFormat),
				periodFrom: format(dateFrom, responseDateFormat),
				periodTo: format(dateTo, responseDateFormat),
				nPasses: tollStationPassesResult.length,
				passList: tollStationPassesResult,
			});
		} catch (e) {
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === "P2025"
			) {
				res.status(404).json({
					status: "failed",
					reason: "Toll station not found",
				});
				return;
			}
			res.status(500).json({
				status: "failed",
				reason: "Error getting toll station passes",
			});
		}
	},
);

export default tollStationPassesRouter;
