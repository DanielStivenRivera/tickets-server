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
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('user_histories')
export class UserHistory {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ nullable: false })
  title: string;
  @Column({ nullable: false })
  description: string;
  @ManyToOne(() => Project, (project: Project) => project.userHistories)
  @JoinColumn({ name: 'projectId' })
  project: Project;
  @Column()
  projectId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @OneToMany(() => Task, (tasks: Task) => tasks.userHistory)
  tasks: Task[];
}
