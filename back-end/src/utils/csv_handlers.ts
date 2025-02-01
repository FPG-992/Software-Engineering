import * as csv from "csv";
import fs from "node:fs";
import { Readable } from "node:stream";
import { parse } from "date-fns";

import { Pass, Prisma } from "@prisma/client";

import { PassRow } from "@src/types/pass";

import { passRowColumns } from "@utils/constants";

export function csvRowCount(filePath: string, hasHeader: boolean = true): Promise<number> {
    let rowCount = hasHeader ? -1 : 0;
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse({ delimiter: "," }))
            .on("data", () => rowCount++)
            .on("end", () => resolve(rowCount))
            .on("error", (error) => reject(error))
    })
}


export function csvPassesStreamToJson(fileStream: Readable): Promise<PassRow[]> {
    return new Promise((resolve, reject) => {
        const passes: PassRow[] = [];

        // Flag to check the column names only once
        let headerRowChecked = false;

        fileStream
            .pipe(
                // "columns: true" option in csv.parse() will return an object with
                // column names as keys, taken from the first row of the CSV file
                // csv.parse({ delimiter: ",", columns: true, maxRecordSize: 1000 })

                csv.parse({ delimiter: ",", maxRecordSize: 1000})
            )
            .on("data", (data: string[]) => {
                if (data.length !== passRowColumns.length) {
                    fileStream.emit("error", new Error(`Invalid number of columns. Expected ${passRowColumns.length} columns`));
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
                            fileStream.emit("error", new Error(`Invalid column name. Expected "${passRowColumns[i]}" in order`));
                            headerRowChecked = true;
                            return;
                        }
                    }
                    headerRowChecked = true;
                    return;
                }

                let dataObject = {
                    timestamp: data[0],
                    tollID: data[1],
                    tagRef: data[2],
                    tagHomeID: data[3],
                    charge: data[4],
                }

                // If an error occurs while parsing a row, we need to emit an error
                // event on the fileStream, otherwise the error will not be properly
                // propagated and handled. (At least that is what GPT says)
                try {
                    passes.push(parsePassRow(dataObject));
                } catch (error) {
                    fileStream.emit("error", error);
                    return;
                }
            })
            .on("end", () => resolve(passes))
            .on("error", (error) => reject(error))
    })
}


function isValidTimestamp(timestamp: string): boolean {
    // parse() will return an "Invalid Date" object, if the timestamp is invalid
    // and using getTime() on that object returns NaN
    // So we check that the result of getTime() is not NaN
    return !isNaN(
        parse(timestamp, "yyyy-MM-dd HH:mm", new Date()).getTime()
    );
}

// * Function to parse a row of the CSV file containing passes to a PassRow object
// The csv parser with "columns: true" option will return an object with column names as keys
// with their respective values as a string type
function parsePassRow(row: { [key: string]: string }): PassRow {
    if (!row.timestamp || !isValidTimestamp(row["timestamp"])) {
        throw new Error(`Invalid timestamp in the CSV file. Expected format: "yyyy-MM-dd HH:mm"`);
    }

    if (!row.tollID) {
        throw new Error(`Invalid tollID in the CSV file.`);
    }

    if (!row.tagRef) {
        throw new Error(`Invalid tagRef in the CSV file.`);
    }

    if (!row.tagHomeID) {
        throw new Error(`Invalid tagHomeID in the CSV file.`);
    }

    if (!row.charge) {
        throw new Error(`Invalid charge in the CSV file.`);
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
    }
}