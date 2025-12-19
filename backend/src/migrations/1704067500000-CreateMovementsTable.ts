import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateMovementsTable1704067500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movements',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'productId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['ENTRY', 'EXIT'],
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'reason',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'supplier',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'invoiceNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'movements',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'movements',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'movements',
      new TableIndex({
        name: 'IDX_MOVEMENTS_PRODUCT',
        columnNames: ['productId'],
      }),
    );

    await queryRunner.createIndex(
      'movements',
      new TableIndex({
        name: 'IDX_MOVEMENTS_USER',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'movements',
      new TableIndex({
        name: 'IDX_MOVEMENTS_TYPE',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'movements',
      new TableIndex({
        name: 'IDX_MOVEMENTS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movements');
  }
}