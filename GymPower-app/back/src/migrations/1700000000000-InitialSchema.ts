import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
  name = "InitialSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "credentials" (
        "id"       SERIAL        NOT NULL,
        "username" varchar(50)   NOT NULL,
        "password" varchar(255)  NOT NULL,
        CONSTRAINT "UQ_credentials_username" UNIQUE ("username"),
        CONSTRAINT "PK_credentials" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id"           SERIAL       NOT NULL,
        "name"         varchar(100) NOT NULL,
        "email"        varchar(100) NOT NULL,
        "nDni"         varchar(20)  NOT NULL,
        "birthdate"    date         NOT NULL,
        "credentialId" integer,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_credential"
          FOREIGN KEY ("credentialId") REFERENCES "credentials"("id")
          ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "appointments_status_enum" AS ENUM ('active', 'cancelled')
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "appointments" (
        "id"      SERIAL                          NOT NULL,
        "date"    TIMESTAMP                       NOT NULL,
        "time"    varchar(10)                     NOT NULL,
        "status"  "appointments_status_enum"      NOT NULL DEFAULT 'active',
        "userId"  integer                         NOT NULL,
        "service" jsonb,
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_appointments_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id")
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "appointments_status_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "credentials"`);
  }
}
