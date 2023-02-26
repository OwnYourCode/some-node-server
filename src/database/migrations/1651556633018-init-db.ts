import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1651556633018 implements MigrationInterface {
  name = 'initDb1651556633018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task"
      (
        "id"           uuid                  NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"    TIMESTAMP             NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP             NOT NULL DEFAULT now(),
        "name"         character varying(50) NOT NULL,
        "description"  character varying(250),
        "startDate"    date                  NOT NULL,
        "deadlineDate" date                  NOT NULL,
        CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "taskTrack"
      (
        "id"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP NOT NULL DEFAULT now(),
        "userTaskId" uuid      NOT NULL,
        "date"       date      NOT NULL,
        "note"       character varying(250),
        CONSTRAINT "PK_2f88b68aebda97bf236dff6b2e1" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
            CREATE TYPE "taskState_name_enum" AS ENUM('active', 'fail', 'success', 'pending')
        `);
    await queryRunner.query(`
      CREATE TABLE "taskState"
      (
        "id"         uuid                  NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"  TIMESTAMP             NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP             NOT NULL DEFAULT now(),
        "name"       "taskState_name_enum" NOT NULL DEFAULT 'pending',
        "userTaskId" uuid,
        CONSTRAINT "UQ_9cb424d1c1e20f249c7e7052c67" UNIQUE ("name"),
        CONSTRAINT "PK_798b756315848be3d86f6942a9f" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "userTask"
      (
        "id"          uuid      NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "taskTrackId" uuid,
        "taskId"      uuid      NOT NULL,
        "userId"      uuid      NOT NULL,
        "stateId"     uuid      NOT NULL,
        CONSTRAINT "PK_0cbeb42d2b76a5c3e8a32d5af89" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
            CREATE TYPE "userProfile_sex_enum" AS ENUM('male', 'female')
        `);
    await queryRunner.query(`
            CREATE TYPE "userProfile_roles_enum" AS ENUM('admin', 'user', 'mentor')
        `);
    await queryRunner.query(`
      CREATE TABLE "userProfile"
      (
        "id"                     uuid                           NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"              TIMESTAMP                      NOT NULL DEFAULT now(),
        "updatedAt"              TIMESTAMP                      NOT NULL DEFAULT now(),
        "firstName"              character varying(50)          NOT NULL,
        "lastName"               character varying(50)          NOT NULL,
        "education"              character varying(50)          NOT NULL,
        "address"                character varying(120)         NOT NULL,
        "birthDate"              date                           NOT NULL,
        "startDate"              date                           NOT NULL,
        "universityAverageScore" double precision               NOT NULL,
        "mathScore"              double precision               NOT NULL,
        "sex"                    "userProfile_sex_enum"         NOT NULL DEFAULT 'male',
        "skype"                  character varying(50),
        "email"                  character varying(50)          NOT NULL,
        "mobilePhone"            character varying(50),
        "roles"                  "userProfile_roles_enum" array NOT NULL DEFAULT '{user}',
        "password"               character varying(150)         NOT NULL,
        "directionId"            uuid,
        CONSTRAINT "UQ_e55a470e06298fde81be86b10ac" UNIQUE ("email"),
        CONSTRAINT "PK_e00a556d077bd0ed3f73198e3a0" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
            CREATE TYPE "direction_name_enum" AS ENUM(
                'React',
                '.Net',
                'Angular',
                'PHP',
                'Java',
                'CPlusPlus'
            )
        `);
    await queryRunner.query(`
      CREATE TABLE "direction"
      (
        "id"          uuid                  NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt"   TIMESTAMP             NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP             NOT NULL DEFAULT now(),
        "name"        "direction_name_enum" NOT NULL DEFAULT 'React',
        "description" character varying(150),
        CONSTRAINT "PK_cd7122416e3f733711b5cfa2924" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "taskTrack"
        ADD CONSTRAINT "FK_ac50c774ee3badb5335f63dce8e" FOREIGN KEY ("userTaskId") REFERENCES "userTask" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "taskState"
        ADD CONSTRAINT "FK_7e723fd891dc3332f946eb15117" FOREIGN KEY ("userTaskId") REFERENCES "userTask" ("id") ON DELETE
          SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "userTask"
        ADD CONSTRAINT "FK_44aae95ce2bbe6ac69cbd225cd6" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "userTask"
        ADD CONSTRAINT "FK_7a5e77524d2c3a66f9c21aa7c0b" FOREIGN KEY ("userId") REFERENCES "userProfile" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "userProfile"
        ADD CONSTRAINT "FK_c34cfe48ba77a71617ac1b0fb61" FOREIGN KEY ("directionId") REFERENCES "direction" ("id") ON DELETE
          SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "userProfile"
        DROP CONSTRAINT "FK_c34cfe48ba77a71617ac1b0fb61"
    `);
    await queryRunner.query(`
      ALTER TABLE "userTask"
        DROP CONSTRAINT "FK_7a5e77524d2c3a66f9c21aa7c0b"
    `);
    await queryRunner.query(`
      ALTER TABLE "userTask"
        DROP CONSTRAINT "FK_44aae95ce2bbe6ac69cbd225cd6"
    `);
    await queryRunner.query(`
      ALTER TABLE "taskState"
        DROP CONSTRAINT "FK_7e723fd891dc3332f946eb15117"
    `);
    await queryRunner.query(`
      ALTER TABLE "taskTrack"
        DROP CONSTRAINT "FK_ac50c774ee3badb5335f63dce8e"
    `);
    await queryRunner.query(`
      DROP TABLE "direction"
    `);
    await queryRunner.query(`
            DROP TYPE "direction_name_enum"
        `);
    await queryRunner.query(`
      DROP TABLE "userProfile"
    `);
    await queryRunner.query(`
            DROP TYPE "userProfile_roles_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "userProfile_sex_enum"
        `);
    await queryRunner.query(`
      DROP TABLE "userTask"
    `);
    await queryRunner.query(`
      DROP TABLE "taskState"
    `);
    await queryRunner.query(`
            DROP TYPE "taskState_name_enum"
        `);
    await queryRunner.query(`
      DROP TABLE "taskTrack"
    `);
    await queryRunner.query(`
      DROP TABLE "task"
    `);
  }
}
