import { Item } from "src/items/item.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'orderid' })
  orderId: number;

  @Column({default: 0})
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User

  @ManyToMany(() => Item, (item) => item.orders)
  @JoinTable()
  items: Item[]

}