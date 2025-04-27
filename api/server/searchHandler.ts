import { Album, Artist, PrismaClient, Track } from "../prisma/client";
import { TypedCache } from "./cache";
import { Cacheable, isSearchMode, SearchMode } from "./helper";

const trackCache = new TypedCache<string, Track>(1000);
const albumCache = new TypedCache<string, Album>(1000);
const artistCache = new TypedCache<string, Artist>(1000);

export async function searchHandler(req, res, prisma: PrismaClient) {
    const params = validateParams(req, res);
    if (!params) {
        return;
    }
    const { query, pageSize, pageNum, searchMode } = params;
    const skip = (pageNum - 1) * pageSize;

    // const cache = getCache(searchMode);
    // const cachedValue = cache.get(query, skip, pageSize);
    // if (cachedValue) {
    //     console.log("Got from cache!");
    //     res.status(200).json(cachedValue);
    //     return;
    // }

    const whereClause = {
        where: { name: { contains: query } },
        skip: skip,
        take: pageSize,
    };
    let table = getTable(searchMode, prisma);
    try {
        const result = await table.findMany(whereClause);
        // cache.set(query, result, skip);
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({
            error: "Internal Service Error: " + error.message,
        });
        return;
    } finally {
        await prisma.$disconnect();
    }
}

function validateParams(
    req,
    res
): {
    query: string;
    pageSize: number;
    pageNum: number;
    searchMode: SearchMode;
} | null {
    const query = req.query.q?.toString();
    if (!query) {
        res.status(400).json({ error: "Search query param 'q' is required" });
        return null;
    }

    const c = Number(req.query.c);
    const o = Number(req.query.o);
    const pageSize = isNaN(c) ? 10 : c;
    const pageNum = isNaN(o) ? 1 : o;
    if (isNaN(pageNum) || isNaN(pageSize) || pageNum < 1 || pageSize < 1) {
        res.status(400).json({ error: "Invalid page or pageSize values." });
        return null;
    }

    const t = req.query.t?.toString() ?? "track";
    const searchMode: SearchMode | null = isSearchMode(t) ? t : null;
    if (!searchMode) {
        res.status(400).json({
            error: "Search query param 't' is invalid, it has to be `track`, `album` or `artist`",
        });
        return null;
    }

    return {
        query,
        pageSize,
        pageNum,
        searchMode,
    };
}

function getTable(searchMode: SearchMode, prisma: PrismaClient): any {
    switch (searchMode) {
        case "track":
            return prisma.track;
        case "album":
            return prisma.album;
        case "artist":
            return prisma.artist;
    }
}

function getCache(searchMode: SearchMode): TypedCache<string, Cacheable> {
    switch (searchMode) {
        case "track":
            return trackCache;
        case "album":
            return albumCache;
        case "artist":
            return artistCache;
    }
}
