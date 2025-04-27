import * as fs from "fs";
import { parse } from "csv-parse";
import { PrismaClient } from "../prisma/client";
import path from "path";
import { castRecord, CsvRecord } from "./models";
import { processRecord } from "./processor";

async function seedMusicDatabase() {
    console.log("Starting to seed the database.");

    const seedFile = path.join("..", process.env.SEED_FILE ?? "");
    if (!fs.existsSync(seedFile)) {
        console.error("Seed file not found");
        return;
    }

    let recordCount = 0;
    const prisma = new PrismaClient();
    try {
        const parser = fs
            .createReadStream(seedFile)
            .pipe(parse({ columns: true, cast: castRecord }));
        for await (const line of parser) {
            try {
                recordCount++;
                const record = line as CsvRecord;
                await processRecord(prisma, record);
                if (recordCount % 1000 == 0) {
                    console.log(`Inserted ${recordCount} records...`);
                }
            } catch {
                recordCount--;
            }
        }

        await prisma.$disconnect();
    } catch (err) {
        console.error("Error seeding database:", err);
        await prisma.$disconnect();
    }

    console.log(`Seeding completed, inserted ${recordCount} records!`);
}

seedMusicDatabase();
