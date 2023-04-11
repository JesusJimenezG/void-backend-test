import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1681203272143 implements MigrationInterface {
    name = 'Init1681203272143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "summoner" ("id" character varying NOT NULL, "account_id" character varying NOT NULL, "profile_icon_id" integer NOT NULL, "revision_date" double precision NOT NULL, "name" character varying NOT NULL, "puuid" character varying NOT NULL, "summoner_level" integer NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_7c746c00ef539c0d32371637edd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e30719d403ebbf2fbeebafc628" ON "summoner" ("name", "region") `);
        await queryRunner.query(`CREATE TABLE "league" ("league_id" character varying NOT NULL, "queue_type" character varying NOT NULL, "tier" character varying NOT NULL, "rank" character varying NOT NULL, "league_points" integer NOT NULL, "wins" integer NOT NULL, "losses" integer NOT NULL, "hot_streak" boolean NOT NULL, "veteran" boolean NOT NULL, "fresh_blood" boolean NOT NULL, "inactive" boolean NOT NULL, "region" character varying NOT NULL, "summonerId" character varying, CONSTRAINT "PK_d2233ce4e3266ca928203c4a37f" PRIMARY KEY ("league_id"))`);
        await queryRunner.query(`ALTER TABLE "league" ADD CONSTRAINT "FK_fd54ed52c177e8fd648e4cf52d0" FOREIGN KEY ("summonerId") REFERENCES "summoner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "league" DROP CONSTRAINT "FK_fd54ed52c177e8fd648e4cf52d0"`);
        await queryRunner.query(`DROP TABLE "league"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e30719d403ebbf2fbeebafc628"`);
        await queryRunner.query(`DROP TABLE "summoner"`);
    }

}
