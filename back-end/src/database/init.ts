import { csvTollStationsStreamToJson } from "@utils/csv_handlers";
import prisma from "./prismaClient";
import { createReadStream } from "node:fs";
import { join } from "node:path";

const filePath = join(__dirname, "../tests/shared/tollstations2024.csv");

const fileStream = createReadStream(filePath);

// Initialize the database with the toll stations from the CSV file
// if the table is empty, otherwise do nothing
csvTollStationsStreamToJson(fileStream).then(async (tollStations) => {
	const tollStationQueryResult = await prisma.tollStation.findMany({});
	if (tollStationQueryResult.length > 0) {
		console.log("Toll stations already exist in the database");
	} else {
		await prisma.tollStation.createMany({
			data: tollStations,
		});
	}
});
