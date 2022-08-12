import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('profile', () => {
    it('should return "Hello World!"', async () => {
      const result: string = '';
      jest.spyOn(appService, 'getHello').mockImplementation(() => result)
      expect(await appController.getHello()).toBe(result);
    });
  });
});
