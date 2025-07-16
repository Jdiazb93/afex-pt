-- CreateTable
CREATE TABLE "Items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "country" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
