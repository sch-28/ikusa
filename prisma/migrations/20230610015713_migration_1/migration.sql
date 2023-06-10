-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guild" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "War" (
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "won" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "guild_name" TEXT NOT NULL,
    "guilds" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "War_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "War_id_key" ON "War"("id");

-- AddForeignKey
ALTER TABLE "War" ADD CONSTRAINT "War_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
