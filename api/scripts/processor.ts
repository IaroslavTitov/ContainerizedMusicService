import { CsvRecord } from "./models";
import { PrismaClient } from "../prisma/client";

export async function processRecord(prisma: PrismaClient, record: CsvRecord) {
    await prisma.track.upsert({
        where: {
            id: record.id,
        },
        create: {
            id: record.id,
            name: record.name,
            trackNumber: record.track_number,
            discNumber: record.disc_number,
            explicit: record.explicit,
            danceability: record.danceability,
            energy: record.energy,
            key: record.key,
            loudness: record.loudness,
            mode: record.mode,
            speechiness: record.speechiness,
            acousticness: record.acousticness,
            instrumentalness: record.instrumentalness,
            liveness: record.liveness,
            valence: record.valence,
            tempo: record.tempo,
            durationMs: record.duration_ms,
            timeSignature: record.time_signature,
            releaseDate: record.release_date,
            album: {
                connectOrCreate: {
                    where: {
                        id: record.album_id,
                    },
                    create: {
                        id: record.album_id,
                        name: record.album,
                    },
                },
            },
            Artists: {
                connectOrCreate: record.artist_ids.map((id, index) => {
                    return {
                        where: {
                            id: id,
                        },
                        create: {
                            id: id,
                            name: record.artists[index],
                        },
                    };
                }),
            },
        },
        update: {},
    });
}
