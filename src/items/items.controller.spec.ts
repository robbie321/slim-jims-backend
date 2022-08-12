import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service'
import { Item } from './item.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;
  let module: TestingModule
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgres://postgres:@db:5432/test', // read this from env
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
      ],
      controllers: [ItemsController],
      providers: [
        ItemsService,{
          provide: getRepositoryToken(Item),
          useClass: Repository
        }]
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  afterEach(async () => {
    await module.close();
  });


  describe('getItems', () => {
    it('should return all items', async () => {
      let result: Promise<Item[]>;
      // jest.spyOn(service, 'getItems').mockImplementation(() => Promise.resolve(result));
      jest.spyOn(service,'getItems').mockImplementation(() => Promise.resolve(result));
      expect(await controller.showMarketplace()).toBe(result);
    });
  })

});
