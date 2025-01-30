import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserHistory } from '../../user-histories/entities/user-history.entity';
import { TaskLog } from './task-log.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column()
  userHistoryId: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;
  @ManyToOne(() => UserHistory, (userHistory: UserHistory) => userHistory.tasks)
  @JoinColumn({ name: 'userHistoryId', referencedColumnName: 'id' })
  userHistory: UserHistory;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @OneToMany(() => TaskLog, (taskLog: TaskLog) => taskLog.task)
  logs: TaskLog[];
}
