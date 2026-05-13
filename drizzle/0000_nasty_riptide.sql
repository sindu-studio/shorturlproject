CREATE TABLE "shortened_links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shortened_links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"short_code" varchar(10) NOT NULL,
	"original_url" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_short_code" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "shortened_links" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_short_code" ON "shortened_links" USING btree ("short_code");