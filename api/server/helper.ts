import { Album, Artist, Track } from "../prisma/client";

export type SearchMode = "track" | "album" | "artist";
export function isSearchMode(str: string): str is SearchMode {
    return str == "track" || str == "album" || str == "artist";
}

export type Cacheable = Track | Album | Artist;
