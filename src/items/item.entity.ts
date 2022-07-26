import { Order } from "src/orders/orders.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn('increment', { name: 'itemid' })
  itemid: number;

  @Column({nullable:true})
  name: string;

  @Column({default: 0})
  price: number;

  @Column({default: 0})
  stockQuantity: number;

  @ManyToMany(() => Order, (order) => order.items)
  orders: Order[]
}