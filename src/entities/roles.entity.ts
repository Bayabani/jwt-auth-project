// role.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable({ name: 'roles_permissions' })
  permissions: Permission[];

  @ManyToMany(() => User, user => user.roles)
  users: User[];

}