import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTickersJoinTable1698355183687 implements MigrationInterface {
    name = 'CreateUsersTickersJoinTable1698355183687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_tickers" ("user_id" character varying NOT NULL, "ticker_id" integer NOT NULL, CONSTRAINT "PK_a96627e09ec058553dc786dddb3" PRIMARY KEY ("user_id", "ticker_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_499f274c0cc0b0c64bb9dc5654" ON "users_tickers" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d63b580cbbe36698aba16e6dc" ON "users_tickers" ("ticker_id") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "watch_list"`);
        await queryRunner.query(`ALTER TABLE "users_tickers" ADD CONSTRAINT "FK_499f274c0cc0b0c64bb9dc56542" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_tickers" ADD CONSTRAINT "FK_0d63b580cbbe36698aba16e6dc6" FOREIGN KEY ("ticker_id") REFERENCES "tickers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_tickers" DROP CONSTRAINT "FK_0d63b580cbbe36698aba16e6dc6"`);
        await queryRunner.query(`ALTER TABLE "users_tickers" DROP CONSTRAINT "FK_499f274c0cc0b0c64bb9dc56542"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "watch_list" text NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d63b580cbbe36698aba16e6dc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_499f274c0cc0b0c64bb9dc5654"`);
        await queryRunner.query(`DROP TABLE "users_tickers"`);
    }

}
