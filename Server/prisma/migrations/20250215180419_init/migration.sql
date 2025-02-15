-- CreateTable
CREATE TABLE "Dancer" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "services" TEXT[],
    "technique" TEXT[],
    "message" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dancer_pkey" PRIMARY KEY ("id")
);
