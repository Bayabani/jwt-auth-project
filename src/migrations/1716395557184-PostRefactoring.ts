import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1716395557184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('hello world')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
