import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'data-source';
import { User } from './entities/user.entity';
@Module({
  imports: [ TypeOrmModule.forRoot(AppDataSource.options),AuthModule,    TypeOrmModule.forFeature([User]), // Inject User repository
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
