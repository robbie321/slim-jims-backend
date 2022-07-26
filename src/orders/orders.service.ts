import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {

    constructor(@InjectRepository(Order) private orders: Repository<Order>){}

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

        //save to the database
        const data = await this.orders.save(order);

        return response.status(200).json(data);
    }
}
