-- CreateTable
CREATE TABLE "Artist" (
    "id" VARCHAR(22) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" VARCHAR(22) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" VARCHAR(22) NOT NULL,
    "name" VARCHAR(1000) NOT NULL,
    "albumId" VARCHAR(22) NOT NULL,
    "trackNumber" SMALLINT NOT NULL,
    "discNumber" SMALLINT NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "danceability" DOUBLE PRECISION NOT NULL,
    "energy" DOUBLE PRECISION NOT NULL,
    "key" SMALLINT NOT NULL,
    "loudness" DOUBLE PRECISION NOT NULL,
    "mode" SMALLINT NOT NULL,
    "speechiness" DOUBLE PRECISION NOT NULL,
    "acousticness" DOUBLE PRECISION NOT NULL,
    "instrumentalness" DOUBLE PRECISION NOT NULL,
    "liveness" DOUBLE PRECISION NOT NULL,
    "valence" DOUBLE PRECISION NOT NULL,
    "tempo" SMALLINT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "timeSignature" SMALLINT NOT NULL,
    "releaseDate" DATE NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtistToTrack" (
    "A" VARCHAR(22) NOT NULL,
    "B" VARCHAR(22) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToTrack_AB_unique" ON "_ArtistToTrack"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToTrack_B_index" ON "_ArtistToTrack"("B");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToTrack" ADD CONSTRAINT "_ArtistToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToTrack" ADD CONSTRAINT "_ArtistToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
