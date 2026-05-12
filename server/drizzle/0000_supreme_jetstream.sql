CREATE TABLE "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"tracking_number" text NOT NULL,
	"sender_name" text NOT NULL,
	"receiver_name" text NOT NULL,
	"receiver_email" text,
	"sender_email" text,
	"receiver_phone" text,
	"sender_phone" text,
	"sender_address" text NOT NULL,
	"receiver_address" text NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"current_location" text DEFAULT '' NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"status" text DEFAULT 'Pending' NOT NULL,
	"estimated_delivery" text,
	"weight" double precision,
	"luggage_type" text DEFAULT 'Package' NOT NULL,
	"description" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "tracking_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_id" integer NOT NULL,
	"status" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tracking_history" ADD CONSTRAINT "tracking_history_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE cascade ON UPDATE no action;