import { test, describe, after, before } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { csvRowCount } from "@utils/csv_handlers";
import api from "@src/tests/utils/api";
import { config } from "dotenv";
import { tagRefCount } from "@prisma/client/sql";

config({ path: path.resolve(__dirname, "../../../.env.test") });

// "**/src/tests/shared"
const sharedFolderPath = path.resolve(__dirname, "../shared");
// "**/shared/passes-sample.csv"
const passesSamplePath = path.join(sharedFolderPath, "passes-sample.csv");
// "**/shared/tollstations2024.csv"
const tollStationsSamplePath = path.join(
	sharedFolderPath,
	"tollstations2024.csv",
);

describe("Testing admin controller", async () => {
	// Create Prisma Client and disconnect it after all tests are done
	const prisma = new PrismaClient();
	before(async () => {
		// Delete all records before starting the tests
		await prisma.tollStation.deleteMany();
	});
	after(async () => {
		// Passes will be deleted along with toll stations since it is onDelete: CASCADE
		await prisma.tollStation.deleteMany();
		await prisma.$disconnect();
	});

	// Toll stations must be set before passes can be added
	// otherwise foreign key constraint will fail
	await test("POST /api/admin/resetstations", async (t) => {
		await t.test(
			"Setting the toll stations when there are no records",
			async () => {
				// Setting content type: multipart/form-data and mime type: 'text/csv'
				const response = await api
					.post("/api/admin/resetstations")
					.set("Content-Type", "multipart/form-data")
					.attach("file", tollStationsSamplePath, { contentType: "text/csv" })
					.timeout(10000); // This is needed if the endpoint does not respond, to not hang

				assert.strictEqual(response.status, 200);
				assert.strictEqual(response.body?.status, "OK");
				// Check if the number of records of passes in the database is equal to the number of rows in the CSV file
				assert.strictEqual(
					await prisma.tollStation.count(),
					await csvRowCount(tollStationsSamplePath),
				);
			},
		);

		// Since we added the toll stations in the previous test, when db was empty
		//
		await t.test(
			"Resetting the toll stations when records exists",
			async () => {
				// Setting content type: multipart/form-data and mime type: 'text/csv'
				const response = await api
					.post("/api/admin/resetstations")
					.set("Content-Type", "multipart/form-data")
					.attach("file", tollStationsSamplePath, { contentType: "text/csv" });

				assert.strictEqual(response.status, 200);
				assert.strictEqual(response.body?.status, "OK");
				// Check if the number of records of passes in the database is equal to the number of rows in the CSV file
				assert.strictEqual(
					await prisma.tollStation.count(),
					await csvRowCount(tollStationsSamplePath),
				);
			},
		);
	});

	await test("POST /api/admin/addpasses", async (t) => {
		await t.test("Adding the passes to the database", async () => {
			// Setting content type: multipart/form-data and mime type: 'text/csv'
			const response = await api
				.post("/api/admin/addpasses")
				.set("Content-Type", "multipart/form-data")
				.attach("file", passesSamplePath, { contentType: "text/csv" });

			assert.strictEqual(response.status, 200);
			// Check if the number of records of passes in the database is equal to the number of rows in the CSV file
			assert.strictEqual(
				await prisma.pass.count(),
				await csvRowCount(passesSamplePath),
			);
		});
		await t.test("Adding does not remove existing passes", async () => {
			const existingPassesCount = await prisma.pass.count();
			const response = await api
				.post("/api/admin/addpasses")
				.set("Content-Type", "multipart/form-data")
				.attach("file", passesSamplePath, { contentType: "text/csv" });

			assert.strictEqual(response.status, 200);
			assert.strictEqual(response.body?.status, "OK");
			assert.strictEqual(
				await prisma.pass.count(),
				(await csvRowCount(passesSamplePath)) + existingPassesCount,
			);
		});
	});

	await test("POST /api/admin/resetpasses", async (t) => {
		await t.test("Resetting the passes when there are no records", async () => {
			// Delete all records of passes
			await prisma.pass.deleteMany();
			const response = await api.post("/api/admin/resetpasses");

			assert.strictEqual(response.status, 200);
			assert.strictEqual(response.body?.status, "OK");

			// Check if the number of records of passes in the database is 0
			assert.strictEqual(await prisma.pass.count(), 0);
		});

		await t.test("Resetting the passes when records exist", async () => {
			const response = await api.post("/api/admin/resetpasses");

			assert.strictEqual(response.status, 200);
			assert.strictEqual(response.body?.status, "OK");

			// Check if the number of records of passes in the database is equal to the number of rows in the CSV file
			assert.strictEqual(await prisma.pass.count(), 0);
		});
	});

	await test("POST /api/admin/healthcheck", async (t) => {
		await t.test("Checking the health of the database", async () => {
			// Resetting the stations and passes
			await api
				.post("/api/admin/resetstations")
				.set("Content-Type", "multipart/form-data")
				.attach("file", tollStationsSamplePath, { contentType: "text/csv" });
			await api
				.post("/api/admin/addpasses")
				.set("Content-Type", "multipart/form-data")
				.attach("file", passesSamplePath, { contentType: "text/csv" });

			// Calling the healthcheck endpoint
			const response = await api.get("/api/admin/healthcheck");

			assert.strictEqual(response.status, 200);
			assert.strictEqual(response.body?.status, "OK");
			assert(response.body?.dbconnection);

			const expectedStationsCount = await csvRowCount(tollStationsSamplePath);
			const expectedPassesCount = await csvRowCount(passesSamplePath);

			assert(response.body?.n_tags);
			assert.strictEqual(response.body?.n_stations, expectedStationsCount);
			assert.strictEqual(response.body?.n_passes, expectedPassesCount);
		});
	});
});
