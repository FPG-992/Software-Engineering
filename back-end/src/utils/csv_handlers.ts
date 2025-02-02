import * as csv from "csv";
import fs from "node:fs";
import type { Readable } from "node:stream";
import { parse } from "date-fns";

import { Prisma } from "@prisma/client";

import type { PassRow } from "@src/types/pass";
import type { TollStationRow } from "@src/types/tollStation";

import { passRowColumns, tollStationRowColumns } from "@utils/constants";

export function csvRowCount(
	filePath: string,
	hasHeader = true,
): Promise<number> {
	let rowCount = hasHeader ? -1 : 0;
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv.parse({ delimiter: "," }))
			.on("data", () => rowCount++)
			.on("end", () => resolve(rowCount))
			.on("error", (error) => reject(error));
	});
}

export function csvPassesStreamToJson(
	fileStream: Readable,
): Promise<PassRow[]> {
	return new Promise((resolve, reject) => {
		const passes: PassRow[] = [];

		// Flag to check the column names only once
		let headerRowChecked = false;

		fileStream
			.pipe(
				// "columns: true" option in csv.parse() will return an object with
				// column names as keys, taken from the first row of the CSV file
				// csv.parse({ delimiter: ",", columns: true, maxRecordSize: 1000 })
				csv.parse({ delimiter: ",", maxRecordSize: 1000 }),
			)
			.on("data", (data: string[]) => {
				// For some reason once the stream is destroyed, it will still keep calling the data event
				// and also destroy(error) when it should emit an error event and enter the error event handler,
				// it does not do that. So we need to check if the stream is destroyed and if it is just return.
				// It is unfortunate that we have to do this, but it is what it is. If it does not want to
				// stop reading even after emitting error, rejecting, or destroying the stream, then let it read
				if (fileStream.destroyed) {
					return;
				}

				if (data.length !== passRowColumns.length) {
					fileStream.destroy();
					reject(
						new Error(
							`Invalid number of columns. Expected ${passRowColumns.length} columns`,
						),
					);
					return;
				}

				// Check that the number of columns and their names
				// are as expected in the columns array
				if (!headerRowChecked) {
					for (let i = 0; i < passRowColumns.length; i++) {
						// For some reason, I have to use trim() even though while
						// I was printing the data and comparing, they were exactly the same
						// This seems to be an issue with the parser, but whatever.
						if (data[i].trim() !== passRowColumns[i]) {
							fileStream.destroy();
							reject(
								new Error(
									`Invalid column name. Expected "${passRowColumns[i]}" in order`,
								),
							);
							return;
						}
					}
					headerRowChecked = true;
					return;
				}

				const dataObject = {
					timestamp: data[0],
					tollID: data[1],
					tagRef: data[2],
					tagHomeID: data[3],
					charge: data[4],
				};

				// If an error occurs while parsing a row, we need to emit an error
				// event on the fileStream, otherwise the error will not be properly
				// propagated and handled. (At least that is what GPT says)
				try {
					passes.push(parsePassRow(dataObject));
				} catch (error) {
					fileStream.destroy();
					if (error instanceof Error) {
						reject(error);
					} else {
						reject(new Error("An unknown error occurred"));
					}
					return;
				}
			})
			.on("end", () => {
				resolve(passes);
			})
			.on("error", (error) => reject(error)) // It does not seem to enter this event handler
			.on("close", () => reject(new Error("Stream closed"))); // It does not seem to enter this event handler
	});
}

export function csvTollStationsStreamToJson(
	fileStream: Readable,
): Promise<TollStationRow[]> {
	return new Promise((resolve, reject) => {
		const tollStations: TollStationRow[] = [];

		let headerRowChecked = false;

		fileStream
			.pipe(csv.parse({ delimiter: ",", maxRecordSize: 3000 }))
			.on("data", (data: string[]) => {
				// For some reason once the stream is destroyed, it will still keep calling the data event
				// and also destroy(error) when it should emit an error event and enter the error event handler,
				// it does not do that. So we need to check if the stream is destroyed and if it is just return.
				// It is unfortunate that we have to do this, but it is what it is. If it does not want to
				// stop reading even after emitting error, rejecting, or destroying the stream, then let it read
				if (fileStream.destroyed) {
					return;
				}

				if (data.length !== tollStationRowColumns.length) {
					fileStream.destroy();
					reject(
						new Error(
							`Invalid number of columns. Expected ${tollStationRowColumns.length} columns`,
						),
					);
					return;
				}
				if (!headerRowChecked) {
					for (let i = 0; i < tollStationRowColumns.length; i++) {
						if (data[i].trim() !== tollStationRowColumns[i]) {
							fileStream.destroy();
							reject(
								new Error(
									`Invalid column name. Expected "${tollStationRowColumns[i]}" in order`,
								),
							);
							return;
						}
					}
					headerRowChecked = true;
					return;
				}

				const dataObject = {
					OpID: data[0],
					Operator: data[1],
					TollID: data[2],
					Name: data[3],
					PM: data[4],
					Locality: data[5],
					Road: data[6],
					Lat: data[7],
					Long: data[8],
					Email: data[9],
					Price1: data[10],
					Price2: data[11],
					Price3: data[12],
					Price4: data[13],
				};

				try {
					tollStations.push(parseTollStationRow(dataObject));
				} catch (error) {
					fileStream.destroy();
					if (error instanceof Error) {
						reject(error);
					} else {
						reject(new Error("An unknown error occurred"));
					}
					return;
				}
			})
			.on("end", () => {
				resolve(tollStations);
			})
			.on("error", (error) => {
				reject(error);
			})
			.on("close", () => reject(new Error("Stream closed")));
	});
}

function isValidTimestamp(timestamp: string): boolean {
	// parse() will return an "Invalid Date" object, if the timestamp is invalid
	// and using getTime() on that object returns NaN
	// So we check that the result of getTime() is not NaN
	return !Number.isNaN(
		parse(timestamp, "yyyy-MM-dd HH:mm", new Date()).getTime(),
	);
}

// * Function to parse a row of the CSV file containing passes to a PassRow object
// The csv parser with "columns: true" option will return an object with column names as keys
// with their respective values as a string type
function parsePassRow(row: { [key: string]: string }): PassRow {
	if (!row.timestamp || !isValidTimestamp(row.timestamp)) {
		throw new Error(
			`Invalid timestamp in the CSV file. Expected format: "yyyy-MM-dd HH:mm"`,
		);
	}

	if (!row.tollID) {
		throw new Error("Invalid tollID in the CSV file.");
	}

	if (!row.tagRef) {
		throw new Error("Invalid tagRef in the CSV file.");
	}

	if (!row.tagHomeID) {
		throw new Error("Invalid tagHomeID in the CSV file.");
	}

	if (!row.charge) {
		throw new Error("Invalid charge in the CSV file.");
	}

	let charge: Prisma.Decimal;
	try {
		charge = new Prisma.Decimal(row.charge);
	} catch {
		throw new Error("Invalid charge in the CSV file.");
	}

	return {
		Timestamp: new Date(row.timestamp),
		TollId: row.tollID,
		TagRef: row.tagRef,
		TagHomeID: row.tagHomeID,
		Charge: charge.toDecimalPlaces(2),
	};
}

function parseTollStationRow(row: { [key: string]: string }): TollStationRow {
	if (!row.OpID) {
		throw new Error("Invalid OpID in the CSV file.");
	}

	if (!row.Operator) {
		throw new Error("Invalid Operator in the CSV file.");
	}

	if (!row.TollID) {
		throw new Error("Invalid TollID in the CSV file.");
	}

	if (!row.Name) {
		throw new Error("Invalid Name in the CSV file.");
	}

	if (!row.PM) {
		throw new Error("Invalid PM in the CSV file.");
	}

	if (!row.Locality) {
		throw new Error("Invalid Locality in the CSV file.");
	}

	if (!row.Road) {
		throw new Error("Invalid Road in the CSV file.");
	}

	if (!row.Lat) {
		throw new Error("Invalid Lat in the CSV file.");
	}
	let Lat: Prisma.Decimal;
	try {
		Lat = new Prisma.Decimal(row.Lat);
		if (Lat.greaterThan(90) || Lat.lessThan(-90)) {
			throw new Error("Invalid Lat in the CSV file.");
		}
	} catch {
		throw new Error("Invalid Lat in the CSV file.");
	}

	if (!row.Long) {
		throw new Error("Invalid Long in the CSV file.");
	}
	let Long: Prisma.Decimal;
	try {
		Long = new Prisma.Decimal(row.Long);
		if (Long.greaterThan(180) || Long.lessThan(-180)) {
			throw new Error("Invalid Long in the CSV file.");
		}
	} catch {
		throw new Error("Invalid Long in the CSV file.");
	}

	if (!row.Email) {
		throw new Error("Invalid Email in the CSV file.");
	}

	if (!row.Price1) {
		throw new Error("Invalid Price1 in the CSV file.");
	}
	let Price1: Prisma.Decimal;
	try {
		Price1 = new Prisma.Decimal(row.Price1);
	} catch {
		throw new Error("Invalid Price1 in the CSV file.");
	}

	if (!row.Price2) {
		throw new Error("Invalid Price2 in the CSV file.");
	}
	let Price2: Prisma.Decimal;
	try {
		Price2 = new Prisma.Decimal(row.Price2);
	} catch {
		throw new Error("Invalid Price2 in the CSV file.");
	}

	if (!row.Price3) {
		throw new Error("Invalid Price3 in the CSV file.");
	}
	let Price3: Prisma.Decimal;
	try {
		Price3 = new Prisma.Decimal(row.Price3);
	} catch {
		throw new Error("Invalid Price3 in the CSV file.");
	}

	if (!row.Price4) {
		throw new Error("Invalid Price4 in the CSV file.");
	}
	let Price4: Prisma.Decimal;
	try {
		Price4 = new Prisma.Decimal(row.Price4);
	} catch {
		throw new Error("Invalid Price4 in the CSV file.");
	}

	return {
		OpID: row.OpID,
		Operator: row.Operator,
		TollID: row.TollID,
		Name: row.Name,
		PM: row.PM,
		Locality: row.Locality,
		Road: row.Road,
		Lat: Lat.toDecimalPlaces(8),
		Long: Long.toDecimalPlaces(8),
		Email: row.Email,
		Price1: Price1.toDecimalPlaces(2),
		Price2: Price2.toDecimalPlaces(2),
		Price3: Price3.toDecimalPlaces(2),
		Price4: Price4.toDecimalPlaces(2),
	};
}
