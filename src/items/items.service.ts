import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
    constructor(@InjectRepository(Item) private items: Repository<Item>){}


    //return all items
    public async getItems(): Promise<Item[]> {
       return await this.items.find();
    }

    //add item to marketplace
    public async addItem(request: any, response: any) {

        //declare object to store item details
        const {
            name,
            price,
            stockQuantity
        } = request.body;

        console.log(request.body);

        //create new Item
        const item = new Item();

        //assign values
        item.name = name;
        item.price = price !== null ? price : '';
        item.stockQuantity = stockQuantity;

        console.log(item.name + "/n" + item.price + "/n" + item.stockQuantity );


        //insert into database
        const data = await this.items.save(item);

        return response.status(200).json(data);
    }

    //remove item from marketplace
    async removeItem(request: any, response: any): Promise<any> {
        //get id from URL
        const { id } = request.params;

        //delete from database
        const item = await this.items.delete(id)

        //retun status
        return response.status(200).json(item);
    }
}
