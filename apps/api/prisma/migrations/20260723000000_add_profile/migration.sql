CREATE TABLE "Profile" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
