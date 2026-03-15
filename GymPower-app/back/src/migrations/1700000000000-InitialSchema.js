"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1700000000000 = void 0;
class InitialSchema1700000000000 {
    constructor() {
        this.name = "InitialSchema1700000000000";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "credentials" (
        "id"       SERIAL        NOT NULL,
        "username" varchar(50)   NOT NULL,
        "password" varchar(255)  NOT NULL,
        CONSTRAINT "UQ_credentials_username" UNIQUE ("username"),
        CONSTRAINT "PK_credentials" PRIMARY KEY ("id")
      )
    `);
            yield queryRunner.query(`
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
            yield queryRunner.query(`
      CREATE TYPE "appointments_status_enum" AS ENUM ('active', 'cancelled')
    `);
            yield queryRunner.query(`
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE IF EXISTS "appointments"`);
            yield queryRunner.query(`DROP TYPE IF EXISTS "appointments_status_enum"`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "users"`);
            yield queryRunner.query(`DROP TABLE IF EXISTS "credentials"`);
        });
    }
}
exports.InitialSchema1700000000000 = InitialSchema1700000000000;
