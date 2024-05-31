// src/resource/resource.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

//  @ManyToOne(() => User, user => user.resources)
  creator: User;
}