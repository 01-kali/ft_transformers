import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksGateway } from './tasks/tasks.gateway';

@Module({
  imports: [],
  controllers: [AppController, TasksController],
  providers: [
    AppService, 
    TasksService, 
    TasksGateway
  ],
})
export class AppModule {}
