import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    username: 'yvyxxmra',
    password: 'VVxmlDD04z4knmKCBusN_CQ4NGKCnHDm',
    port: 5432,
    host: 'kandula.db.elephantsql.com',
    database: 'yvyxxmra',
    synchronize: true,
    // entities: [User,Item],
    entities: ['dist/**/*.entity{.ts,.js}'],
};