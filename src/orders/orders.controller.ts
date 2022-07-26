import { Controller, Get,   Request, Req, Res, UseGuards, Post } from '@nestjs/common';
import { response } from 'express';
import { request } from 'http';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private orderService: OrdersService){}

    @Get('userOrders')
    @UseGuards(JwtAuthGuard)
    async getUserOrders(@Req() request, @Res() response){

        return await this.orderService.fetchUserOrders(request,response);
    }

    @Post('createOrder')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Req() request, @Res() response){
        this.orderService.createOrder(request,response);
    }
}
