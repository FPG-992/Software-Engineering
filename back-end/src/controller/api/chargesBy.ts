import express from "express";
import { parse, format, isValid } from "date-fns";
import prisma from "@src/database/prismaClient";

import { chargesByQuery } from "@prisma/client/sql";
import { paramDateFormat, responseDateFormat } from "@utils/constants";
import { Prisma } from "@prisma/client";
import { json2csv } from "json-2-csv";

const chargesByRouter = express.Router();

chargesByRouter.get("/:tollOpID/:date_from/:date_to", async (req, res) => {
	try {
		const { tollOpID, date_from, date_to } = req.params;
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
		// The first checks if the tollOpID,
		// and if it does not, an error is thrown.
		// The underscore prefix is used to indicate that the variable is not used.
		const [_tollOpIDExists, chargesByResult] = await prisma.$transaction([
			prisma.tollStation.findFirstOrThrow({
				select: { OpID: true },
				where: {
					OpID: tollOpID,
				},
			}),
			prisma.$queryRawTyped(chargesByQuery(tollOpID, dateFrom, dateTo)),
		]);

		const resBody = {
			tollOpID,
			requestTimestamp: format(new Date(Date.now()), responseDateFormat),
			periodFrom: format(dateFrom, responseDateFormat),
			periodTo: format(dateTo, responseDateFormat),
			vOpList: chargesByResult,
		};

		if (outputFormat === "csv") {
			res.setHeader("Content-Type", "text/csv; charset=utf-8").send(
				// Convert the JSON object to CSV format
				// It looks unorthodox but it needs an array with objects
				// which can be nested but none of them should have arrays
				// to get the format we want, which is:
				// tollOpID,requestTimestamp,periodFrom,periodTo,vOpList.visitingOpID,vOpList.nPasses,vOpList.passesCost
				json2csv(
					chargesByResult.map((v) => ({
						...resBody,
						vOpList: {
							...v,
							passesCost: v.passesCost?.toString(),
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
				reason: "tollOpID or tagOpID not found",
			});
		} else {
			res.status(500).send({
				status: "failed",
				reason: "Unknown internal server error",
			});
		}
	}
});

export default chargesByRouter;
