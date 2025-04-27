export interface CsvRecord {
    id: string;
    name: string;
    album: string;
    album_id: string;
    artists: string[];
    artist_ids: string[];
    track_number: number;
    disc_number: number;
    explicit: boolean;
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    duration_ms: number;
    time_signature: number;
    year: number;
    release_date: Date;
}

function asNumber(value): number {
    return Number(value);
}

function asBoolean(value): boolean {
    return value.toLowerCase() === "true";
}

function asDate(value): Date {
    return new Date(value);
}

function asStringArray(value): string[] {
    // Have to do these shenanigans to convert ' into " without ruining artist names
    const convertedQuotes = value
        .replaceAll('"', "'")
        .replace("['", '["')
        .replace("']", '"]')
        .replaceAll("',", '",')
        .replaceAll(", '", ', "');
    const json = JSON.parse(convertedQuotes);
    return json as string[];
}

export function castRecord(value: string, context): any {
    if (context.header) return value;

    try {
        const index = context.index;
        switch (true) {
            case index <= 3:
                return value;
            case index == 4 || index == 5:
                return asStringArray(value);
            case index == 8:
                return asBoolean(value);
            case index == 23:
                return asDate(value);
        }
        return asNumber(value);
    } catch {
        return null;
    }
}
