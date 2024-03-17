import { Table, Column, Model, DataType, AllowNull, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Client } from './client';

interface EmployeeAttributes {
    id: number;
    name: string;
    status: string;
    email: string;
    cellphone: number;
    job_title: string;
    job_grade:string;
    joining_date: Date;
    division: string;
    tech_stack: string;
    gender: string;
    skills_employee: string[];
    propose_action: string;
    reason_current_state: string;
    image_url: string;
    activeDB?: boolean;
}

export interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> {}

@Table({
  tableName: 'employee',
  timestamps: true,
  paranoid: true,
})
export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> {

  @Column(DataType.STRING(128))
  public name!: string;

  @Column(DataType.STRING(128))
  public status!: string;

  @Column(DataType.STRING(128))
  public email!: string;

  @Column(DataType.BIGINT)
  public cellphone!: number;


  @Column(DataType.STRING(128))
  public job_title!: string;

  @Column(DataType.STRING(128))
  public job_grade!: string;

  @Column(DataType.DATE)
  public joining_date!: Date;

  @Column(DataType.STRING(128))
  public division!: string;

  @Column(DataType.STRING(128))
  public tech_stack!: string;

  @Column(DataType.STRING(128))
  public gender!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  public skills_employee!: string[];

  @Column(DataType.STRING(128))
  public propose_action!: string;

  @Column(DataType.STRING(128))
  public reason_current_state!: string;

  @Column(DataType.STRING)
  public image_url!: string;
  
  @CreatedAt
  @Column(DataType.DATE)
  public createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt!: Date;

  @DeletedAt
  @Column(DataType.DATE)
  public deletedAt!: Date;

  @Column(DataType.BOOLEAN)
  public activeDB?: boolean;

  //@HasMany(() => Client)
  //public clients!: Client[];
}