import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

interface ICommonEntity {
  id: string;
}

interface IInfoEntity {
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class CommonEntity implements ICommonEntity, IInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
