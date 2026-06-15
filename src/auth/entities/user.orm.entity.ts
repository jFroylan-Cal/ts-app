import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ValidRoles } from '../enums/valid-role.enum';

@Entity({ name: 'Users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'User_uuidId' })
  id!: string;

  @Column({ name: 'User_strName' })
  name!: string;

  @Column({ name: 'User_strLastName' })
  lastName!: string;

  @Column({ name: 'User_strSourName' })
  sourName!: string;

  @Column({ name: 'User_strEmail' })
  email!: string;

  @Column({ name: 'User_strPhone' })
  phone!: string;

  @Column({ name: 'User_strSecret' })
  secret!: string;

  @Column({ name: 'User_dteCreated' })
  createdAt!: Date;

  @Column({ name: 'User_dteUpdate' })
  updatedAt!: Date;

  @Column({ name: 'User_bolIsActive', default: true })
  isActive!: boolean;

  @Column({
    name: 'User_arrRoles',
    type: 'text',
    array: true,
    default: ['viewer']
  })
  role!: string[];
}
