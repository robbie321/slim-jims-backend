import { Order } from "src/orders/orders.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Image } from '../../../images/image.entity';

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

  // @OneToMany(() => Image, (image) => image.items, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn()
  // image: Image[];

  @ManyToMany(() => Order, (order) => order.items)
  orders: Order[]
}