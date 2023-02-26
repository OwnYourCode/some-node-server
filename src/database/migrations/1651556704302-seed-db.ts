import {MigrationInterface, QueryRunner} from "typeorm";

export class seedDb1651556704302 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        'INSERT INTO direction (name, description)\n' +
        "VALUES ('.Net', 'It\"s modern platform for back-end development created by Microsoft'),\n" +
        "       ('React', 'It\"s modern library widely used in front-end created by Facebook'),\n" +
        "       ('Angular', 'It\"s widely used front-end framework by Google'),\n" +
        "       ('PHP', 'It\"s script language used for back-end tasks'),\n" +
        "       ('Java', 'It\"s back-end language created by Oracle')",
      );
      await queryRunner.query(
        'INSERT INTO "taskState" (name) VALUES \n' +
        "        ('active'),\n" +
        "        ('pending'),\n" +
        "        ('success'),\n" +
        "        ('fail')",
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
