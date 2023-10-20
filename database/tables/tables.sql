BEGIN TRANSACTION;

CREATE TABLE "tickers" (
  "id" SERIAL NOT NULL, 
  "symbol" character varying, 
  "description" character varying, 
  CONSTRAINT "PK_c2a03993ab14bc2e244d7571f1c" 
  PRIMARY KEY ("id"));

CREATE TABLE "users" (
  "id" character varying NOT NULL, 
  "balance" double precision NOT NULL, 
  "telephone" character varying, 
  "email" character varying NOT NULL, 
  "name" character varying NOT NULL, 
  "nickname" character varying, 
  "address" character varying, 
  "picture" character varying NOT NULL, 
  "watch_list" text NOT NULL, 
  "created_on" TIMESTAMP NOT NULL DEFAULT now(), 
  "updated_on" TIMESTAMP NOT NULL DEFAULT now(), 
  CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" 
  PRIMARY KEY ("id"));

CREATE TABLE "transactions" (
  "id" SERIAL NOT NULL, 
  "symbol" character varying NOT NULL, 
  "quantity" integer NOT NULL, 
  "price" double precision NOT NULL, 
  "type" character varying NOT NULL, 
  "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
  "user_id" character varying, 
  CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" 
  PRIMARY KEY ("id"));

ALTER TABLE "transactions" 
ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" 
FOREIGN KEY ("user_id") 
REFERENCES "users"("id") 
ON DELETE CASCADE 
ON UPDATE NO ACTION;

COMMIT;
