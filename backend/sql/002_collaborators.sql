CREATE TABLE "collaborators" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(100) NOT NULL UNIQUE,
	"cpf" VARCHAR(11) NOT NULL UNIQUE,
	"password_hash" VARCHAR(60) NOT NULL,
	"is_admin" BOOL DEFAULT false NOT NULL,
    "phone" VARCHAR(11),
    "hire_date" DATE NOT NULL,
    "termination_date" DATE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "role" VARCHAR(14) CHECK("role" IN ('administrator','manager','operator')) NOT NULL,
    "company_id" INTEGER NOT NULL REFERENCES companies ("id") ON  DELETE RESTRICT
);