import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable } from 'typeorm';
import { Role } from './roles.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Ensure the username is unique
  username: string;

    @Column({ unique: true })
    email: string;

  @Column()
  password: string;
  
  @ManyToMany(() => Role, role => role.users)
  @JoinTable({name:'users_roles'})
  roles: Role[];
}

