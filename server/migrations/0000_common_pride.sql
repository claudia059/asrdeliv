CREATE TABLE "ShipmentFeedLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"TrackingNumber" text NOT NULL,
	"Remark" text,
	"Status" text NOT NULL,
	"Location" text NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admin_name_unique" UNIQUE("name"),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "company_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"company_address" text NOT NULL,
	"company_phone" text NOT NULL,
	"tracking-prefix" text DEFAULT 'TRK',
	"company_email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_personnel" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_no" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "delivery_personnel_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "office_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_name" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_name" text NOT NULL,
	"package_type" text NOT NULL,
	"package_description" text NOT NULL,
	"weight" text NOT NULL,
	"dimensions" text NOT NULL,
	"tracking_number" text NOT NULL,
	"delivery_instructions" text,
	"delivery_date" timestamp with time zone,
	"delivery_fee" integer NOT NULL,
	"received_at" timestamp with time zone DEFAULT now(),
	"to_be_delivered_at" timestamp with time zone,
	"location" text NOT NULL,
	"latitude" text,
	"longitude" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"sender_full_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"sender_phone_no" text,
	"sender_address" text NOT NULL,
	"receiver_full_name" text NOT NULL,
	"receiver_email" text NOT NULL,
	"receiver_phone_no" text,
	"receiver_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "packages_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "types_of_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_type" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "types_of_deliveries_delivery_type_unique" UNIQUE("delivery_type")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"mobile" text,
	"location" text,
	"title" text,
	"bio" text,
	"avatar" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;