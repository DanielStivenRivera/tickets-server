import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1738096381027 implements MigrationInterface {
  name = 'Users1738096381027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
    "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, 
    "name" character varying NOT NULL, "email" character varying NOT NULL, 
    "password" character varying NOT NULL, 
    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
