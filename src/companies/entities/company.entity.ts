import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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
  @OneToMany(() => User, (user: User) => user.company)
  users: User[];
}
