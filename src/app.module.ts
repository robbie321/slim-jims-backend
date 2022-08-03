import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {config} from './orm.config';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
// import { ImagesModule } from '../../images/images.module';

@Module({
  imports: [TypeOrmModule.forRoot(config),OrdersModule, UsersModule, AuthModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
