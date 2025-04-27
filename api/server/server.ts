import express from "express";
import { PrismaClient } from "../prisma/client";
import { searchHandler } from "./searchHandler";

const prisma = new PrismaClient();
const app = express();
const port = 8080;

app.get("/search", (req, res) => searchHandler(req, res, prisma));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
