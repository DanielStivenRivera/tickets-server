import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task, TaskStatus } from './task.entity';

export enum TaskLogEventType {
  CHANGE_STATUS = 'CHANGE_STATUS',
  COMMENT = 'COMMENT',
}

export interface TaskLogStatusChange {
  previous: TaskStatus;
  current: TaskStatus;
}

@Entity('task_logs')
export class TaskLog {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ enum: TaskLogEventType, type: 'enum' })
  eventType: TaskLogEventType;
  @Column({ nullable: true })
  comment: string;
  @Column({ nullable: true, type: 'json' })
  statusChange: TaskLogStatusChange;
  @Index()
  @Column()
  taskId: number;
  @ManyToOne(() => Task, (task: Task) => task.logs)
  @JoinColumn({ referencedColumnName: 'id', name: 'taskId' })
  task: Task;
  @CreateDateColumn()
  createdAt: Date;
}
