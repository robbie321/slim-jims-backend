import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Item } from 'src/items/item.entity';
import { ItemsModule } from 'src/items/items.module';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthModule, TypeOrmModule.forFeature([Item])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
