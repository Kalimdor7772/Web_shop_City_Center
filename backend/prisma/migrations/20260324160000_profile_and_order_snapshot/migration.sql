DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'User' AND column_name = 'name'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'User' AND column_name = 'firstName'
    ) THEN
        ALTER TABLE "User" RENAME COLUMN "name" TO "firstName";
    END IF;
END $$;

ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "lastName" TEXT,
    ADD COLUMN IF NOT EXISTS "phone" TEXT,
    ADD COLUMN IF NOT EXISTS "avatar" TEXT,
    ADD COLUMN IF NOT EXISTS "profile" JSONB;

ALTER TABLE "Order"
    ADD COLUMN IF NOT EXISTS "customerName" TEXT,
    ADD COLUMN IF NOT EXISTS "customerPhone" TEXT,
    ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT,
    ADD COLUMN IF NOT EXISTS "comment" TEXT,
    ADD COLUMN IF NOT EXISTS "address" JSONB;
