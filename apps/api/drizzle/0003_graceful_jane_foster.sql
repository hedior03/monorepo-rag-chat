CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"text_hash" text NOT NULL,
	"text_length" integer NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "documents" USING hnsw ("embedding" vector_cosine_ops);