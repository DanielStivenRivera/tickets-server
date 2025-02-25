import {
  AfterRecover,
  AfterSoftRemove,
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
import { Company } from '../../companies/entities/company.entity';
import { UserHistory } from '../../user-histories/entities/user-history.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  companyId: number;
  @ManyToOne(() => Company, (company: Company) => company.projects)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Company;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @Column({ default: true })
  isActive: boolean;
  @AfterSoftRemove()
  updateStatusAfterSoftRemove() {
    this.isActive = false;
  }
  @AfterRecover()
  updateStatusAfterRestore() {
    this.isActive = true;
  }
  @OneToMany(
    () => UserHistory,
    (userHistory: UserHistory) => userHistory.project,
  )
  userHistories: UserHistory[];
}
