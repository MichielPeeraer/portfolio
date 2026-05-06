CREATE TABLE IF NOT EXISTS "learning_embeds" (
    "id" serial PRIMARY KEY NOT NULL,
    "src" text NOT NULL,
    "alt" text NOT NULL,
    "unoptimized" boolean DEFAULT false NOT NULL,
    "wide" boolean DEFAULT false NOT NULL,
    "sort_order" integer NOT NULL
);

INSERT INTO "learning_embeds" ("src", "alt", "unoptimized", "wide", "sort_order")
SELECT "boot_dev_embed_src", "boot_dev_embed_alt", false, false, 0
FROM "personal_info"
WHERE NOT EXISTS (SELECT 1 FROM "learning_embeds");

INSERT INTO "learning_embeds" ("src", "alt", "unoptimized", "wide", "sort_order")
SELECT "duolingo_embed_src", "duolingo_embed_alt", "duolingo_embed_unoptimized", false, 1
FROM "personal_info"
WHERE NOT EXISTS (
    SELECT 1 FROM "learning_embeds" WHERE "sort_order" = 1
);
