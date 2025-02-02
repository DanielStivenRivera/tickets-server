import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column()
  name: string;
  @Column({ nullable: false, unique: true })
  nit: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ nullable: false })
  phone: string;
  @Column({ nullable: false })
  address: string;
  @OneToMany(() => Project, (project: Project) => project.company)
  projects: Project[];
}
