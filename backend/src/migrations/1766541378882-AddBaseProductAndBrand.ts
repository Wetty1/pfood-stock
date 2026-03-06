import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseProductAndBrand1766541378882 implements MigrationInterface {
    name = 'AddBaseProductAndBrand1766541378882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "baseProduct" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "brand" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "baseProduct"`);
    }
}