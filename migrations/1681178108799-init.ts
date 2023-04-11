import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1681178108799 implements MigrationInterface {
    name = 'Init1681178108799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "summoner" ("void_id" SERIAL NOT NULL, "account_id" character varying NOT NULL, "profile_icon_id" integer NOT NULL, "revision_date" integer NOT NULL, "name" character varying NOT NULL, "id" character varying NOT NULL, "puuid" character varying NOT NULL, "summoner_level" integer NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_f830208b6840307f9a370cb30ae" PRIMARY KEY ("void_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "summoner"`);
    }

}
