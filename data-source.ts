import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/roles.entity';
import { Permission } from 'src/entities/permission.entity';

export const AppDataSource = new DataSource({ 
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'ibrahim',
    database: 'nest-auth-db',
    entities: [User, Role, Permission],
    //migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: true, // Set to false to use migrations 
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    }); 