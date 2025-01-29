import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('user_histories')
export class UserHistory {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ nullable: false })
  title: string;
  @Column({ nullable: false })
  description: string;
  @OneToMany(() => Project, (project: Project) => project.userHistories)
  @JoinColumn({ name: 'projectId', referencedColumnName: 'id' })
  project: Project;
  @Column()
  projectId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
