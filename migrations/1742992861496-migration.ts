import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742992861496 implements MigrationInterface {
  name = 'Migration1742992861496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "qtim_test"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(128) NOT NULL, "password_hash" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))'
    );
    await queryRunner.query(
      'CREATE TABLE "qtim_test"."article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(512) NOT NULL, "description" text, "text" text NOT NULL, "authorId" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))'
    );
    await queryRunner.query(
      'ALTER TABLE "qtim_test"."article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "qtim_test"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "qtim_test"."article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"');
    await queryRunner.query('DROP TABLE "qtim_test"."article"');
    await queryRunner.query('DROP TABLE "qtim_test"."user"');
  }
}
