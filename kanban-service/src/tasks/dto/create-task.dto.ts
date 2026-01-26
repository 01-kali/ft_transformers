import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TaskStatus } from './task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus; 

  @IsInt()
  projectId: number;
}
