// src/permission/permission.repository.ts
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
          constructor(private dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }
}
