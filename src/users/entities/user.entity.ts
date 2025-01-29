import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ nullable: false })
  password: string;
  @ManyToOne(() => Company, (company: Company) => company.users)
  @JoinColumn({ name: 'companyId' })
  company: Company;
  @Column({ nullable: false })
  companyId: number;
}
