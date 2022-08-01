import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Item } from "./items/item.entity";
import { Order } from "./orders/orders.entity";
import { User } from "./users/user.entity";

export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    username: 'yvyxxmra',
    password: 'VVxmlDD04z4knmKCBusN_CQ4NGKCnHDm',
    port: 5432,
    host: 'kandula.db.elephantsql.com',
    database: 'yvyxxmra',
    synchronize: true,
    entities: [User,Item, Order],
    // entities: ['dist/**/*.entity{.ts,.js}'],
};