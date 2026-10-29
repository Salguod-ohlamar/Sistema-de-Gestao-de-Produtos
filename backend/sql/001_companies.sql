CREATE TABLE "companies" (
	"id" serial PRIMARY KEY,
	"trade_name" varchar(255) NOT NULL,
    "legal_name" varchar(255) NOT NULL,
	"email" varchar(100) NOT NULL UNIQUE,
	"cnpj" VARCHAR(14) NOT NULL UNIQUE,
    "phone" VARCHAR(11) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "segment" VARCHAR(14) CHECK("segment" IN ('technology','retail','services','industry')) NOT NULL
);