import express from "express";
import { parse, format, isValid } from "date-fns";
import prisma from "@src/database/prismaClient";

import { passesCostQuery } from "@prisma/client/sql";
import { paramDateFormat, responseDateFormat } from "@utils/constants";
import { Prisma } from "@prisma/client";

const passesCostRouter = express.Router();

passesCostRouter.get(
	"/:tollOpID/:tagOpID/:date_from/:date_to",
	async (req, res) => {
		try {
			const { tollOpID, tagOpID, date_from, date_to } = req.params;

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
			// The first two queries check if the tollOpID and tagOpID exist,
			// and if they do not exist, an error is thrown.
			// The underscore prefix is used to indicate that the variables are not used.
			const [_tollOpIDExists, _tagOpIDExists, [{ nPasses, passesCost }]] =
				await prisma.$transaction([
					prisma.tollStation.findFirstOrThrow({
						select: { OpID: true },
						where: {
							OpID: tollOpID,
						},
					}),
					prisma.tollStation.findFirstOrThrow({
						select: { OpID: true },
						where: {
							OpID: tagOpID,
						},
					}),
					prisma.$queryRawTyped(
						passesCostQuery(tollOpID, tagOpID, dateFrom, dateTo),
					),
				]);

			// "nPasses" and "passesCost" will never be null or undefined
			// because if the transaction gets to that point to execute
			// the third query, it means that the stationOpID and tagOpID exist.
			// And also "passesCharge" is coalesced to 0 in the SQL query.
			// and in "nPasses", "COUNT" always returns a number.
			res.json({
				tollOpID,
				tagOpID,
				requestTimestamp: format(new Date(Date.now()), responseDateFormat),
				periodFrom: format(dateFrom, responseDateFormat),
				periodTo: format(dateTo, responseDateFormat),
				nPasses,
				passesCost,
			});
		} catch (e) {
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === "P2025"
			) {
				res.status(500).json({
					status: "failed",
					reason: "tollOpID or tagOpID not found",
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

export default passesCostRouter;
