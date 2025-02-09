import express from "express";
import { parse, format, isValid } from "date-fns";
import prisma from "@src/database/prismaClient";

import { passAnalysisQuery } from "@prisma/client/sql";
import { paramDateFormat, responseDateFormat } from "@utils/constants";
import { Prisma } from "@prisma/client";
import { json2csv } from "json-2-csv";

const passAnalysisRouter = express.Router();

passAnalysisRouter.get(
	"/:stationOpID/:tagOpID/:date_from/:date_to",
	async (req, res) => {
		try {
			const { stationOpID, tagOpID, date_from, date_to } = req.params;
			const outputFormat = req.query.format;

			// Parse the date_from and date_to parameters
			const dateFrom = parse(date_from, paramDateFormat, new Date());
			const dateTo = parse(date_to, paramDateFormat, new Date());

			// If the date parameters are invalid, return a 400 response
			if (!isValid(dateFrom) || !isValid(dateTo)) {
				res.status(400).json({
					status: "failed",
					reason: "Invalid date format, expected: yyyyMMdd",
				});
				return;
			}

			// Set the time to the end of the day for the dateTo parameter
			// to include all passes on that day. The query's date range is inclusive.
			dateTo.setHours(23, 59, 59, 999);

			// The queries are executed sequentially in a transaction
			// and if the previous query fails, the subsequent queries are not executed
			// and the transaction is rolled back.
			// The first two queries check if the stationOpID and tagOpID exist,
			// and if they do not exist, an error is thrown.
			// The underscore prefix is used to indicate that the variables are not used.
			const [_stationOpIDExists, _tagOpIDExists, passAnalysisResult] =
				await prisma.$transaction([
					prisma.tollStation.findFirstOrThrow({
						select: { OpID: true },
						where: {
							OpID: stationOpID,
						},
					}),
					prisma.tollStation.findFirstOrThrow({
						select: { OpID: true },
						where: {
							OpID: tagOpID,
						},
					}),
					prisma.$queryRawTyped(
						passAnalysisQuery(stationOpID, tagOpID, dateFrom, dateTo),
					),
				]);

			const resBody = {
				stationOpID,
				tagOpID,
				requestTimestamp: format(new Date(Date.now()), responseDateFormat),
				periodFrom: format(dateFrom, responseDateFormat),
				periodTo: format(dateTo, responseDateFormat),
				nPasses: passAnalysisResult.length,
				passList: passAnalysisResult.map((v) => ({
					...v,
					timestamp: format(v.timestamp, responseDateFormat),
				})),
			};

			if (outputFormat === "csv") {
				res.setHeader("Content-Type", "text/csv; charset=utf-8").send(
					json2csv(
						passAnalysisResult.map((v) => ({
							...resBody,
							passList: {
								...v,
								timestamp: format(v.timestamp, responseDateFormat),
								passCharge: v.passCharge?.toString(),
							},
						})),
						{ expandNestedObjects: true },
					),
				);
			} else {
				res.json(resBody);
			}
		} catch (e) {
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === "P2025"
			) {
				res.status(500).json({
					status: "failed",
					reason: "stationOpID or tagOpID not found",
				});
			} else {
				res.status(500).send({
					status: "failed",
					reason: "Unknown internal server error",
				});
			}
		}
	},
);

export default passAnalysisRouter;
