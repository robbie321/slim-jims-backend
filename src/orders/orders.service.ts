import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/item.entity';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {

    constructor(@InjectRepository(Order) private orders: Repository<Order>, @InjectRepository(Item) private items: Repository<Item>){}

    async fetchUserOrders(request, response): Promise<any>{

        //get user id from bearer token
        const {userId} = request.user;

        const userOrders = await this.orders
        //get orders repository
        .createQueryBuilder('orders')
        //join the users table
        .leftJoinAndSelect('orders.user', 'user')
        //join the items table
        .innerJoinAndSelect('orders.items','items')
        //select orders by userId
        .where('orders.userUserId = :userId', {userId})
        .getMany();

        return response.status(200).json(userOrders);
    }

    async createOrder(request, response): Promise<any>{

        //get info from body
        const {
            items
        } = request.body

        //get user id from bearer token
        const userId = request.user


        //create a new order
        const order = new Order();
        order.user = userId;
        order.items = items

        //minus stock value from item
        this.minusStockQuanity(order.items);

        //save to the database
        const data = await this.orders.save(order);

        return response.status(200).json(data);
    }

    async  minusStockQuanity(item: Array<Item>){

        //loop through items
        for(let i = 0; i <= item.length - 1; i++){
            //get the id of an item
            let id = item[i].itemid;

            //update the items stockQuantity value by minusing 1 from it
            await this.items.createQueryBuilder().update(Item).set({stockQuantity: item[i].stockQuantity - 1}).where("items.itemid = :id", {id}).execute()
        }
    }
}



