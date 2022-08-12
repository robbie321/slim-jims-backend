import { Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/auth/jwtAdmin-auth.guard';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(private itemService: ItemsService){}

    @Get('marketplace')
    async showMarketplace(){
        return await this.itemService.getItems();
    }


    //add item
    @Post('add-item')
    @UseGuards(JwtAdminAuthGuard)
    async addItem(@Req() request, @Res() response){
        this.itemService.addItem(request,response);
    }

    //remove item
    @Delete('remove-item/:id')
    @UseGuards(JwtAdminAuthGuard)
    async removeItem(@Req() request, @Res() response){
        return await this.itemService.removeItem(request,response)
    }

}
