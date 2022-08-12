import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {config} from './orm.config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';

// import { ImagesModule } from '../../images/images.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), AuthModule, ItemsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
