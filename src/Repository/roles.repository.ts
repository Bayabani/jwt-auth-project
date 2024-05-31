// src/role/role.repository.ts
import { Role } from 'src/entities/roles.entity';
import { DataSource, EntityRepository, Repository } from 'typeorm';
@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
          constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
}