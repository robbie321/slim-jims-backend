import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Order} from '../orders/orders.entity'


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'userid' })
  userId: number;

  @Column({nullable:true})
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ nullable: true, name: 'phonenumber' })
  phoneNumber: string;

  @Column({ nullable: true, name: 'firstAddress' })
  firstAddress: string;

  @Column({ nullable: true, name: 'secondAddress' })
  secondAddress: string;

  @Column({ nullable: true, name: 'county' })
  county: string;

  @Column({ nullable: true, name: 'eircode' })
  eircode: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ nullable: false, name: 'userRole', default: 'user' })
  role: string;

  @Column({ nullable: true, name: 'refreshtoken' })
  refreshToken: string;

  @Column({ type: 'date', nullable: true, name: 'refreshtokenexp' })
  refreshTokenExp: string;

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: 'CASCADE'
  })
  orders: Order[];
}