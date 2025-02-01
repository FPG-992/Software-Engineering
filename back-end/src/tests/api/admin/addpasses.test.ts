import { app } from "@src/app";
import supertest from "supertest";
import { test, after, beforeEach, describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { csvRowCount } from "@utils/csv_handlers";
import { env } from "node:process";

const api = supertest(app);

// "**/src/tests/shared"
const shared_folder_path = path.resolve(__dirname, "../../shared");

describe("POST /admin/addpasses", () => {

    // Create Prisma Client and disconnect it after all tests are done
    const prisma = new PrismaClient()
    after(async () => {
        await prisma.pass.deleteMany();
        await prisma.$disconnect();
    })

    // "**/shared/passes-sample.csv"
    const passes_sample_path = `${shared_folder_path}/passes-sample.csv`

    test("Adding the passes to the database", async () => {
        // Setting content type: multipart/form-data and mime type: 'text/csv'
        const response = await api.post("/admin/addpasses")
            .set("Content-Type", "multipart/form-data")
            .attach("file", passes_sample_path, { contentType: "text/csv" });
        
        console.log(response.body);

        // Check if the number of records of passes in the database is equal to the number of rows in the CSV file
        assert.strictEqual(
            await prisma.pass.count(),
            await csvRowCount(passes_sample_path)
        );

        assert.strictEqual(response.status, 201);
    })

})