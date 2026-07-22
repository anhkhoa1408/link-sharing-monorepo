CREATE TYPE "Platform" AS ENUM (
  'GITHUB',
  'FRONTEND_MENTOR',
  'TWITTER',
  'LINKEDIN',
  'YOUTUBE',
  'FACEBOOK',
  'TWITCH',
  'DEV_TO',
  'CODEWARS',
  'FREE_CODE_CAMP',
  'GITLAB',
  'HASHNODE',
  'STACK_OVERFLOW'
);

CREATE TABLE "Link" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "platform" "Platform" NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Link_userId_url_key" ON "Link"("userId", "url");
