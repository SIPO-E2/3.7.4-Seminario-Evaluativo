// models/project.ts

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Client } from "./client";
import { User } from "./user";
import { JobPosition } from "./jobPosition";
import { Optional } from "sequelize";

interface ProjectAttributes {
  id: number;
  name: string;
  status: number;
  revenue: number;
  region: string;
  posting_date: Date;
  exp_closure_date: Date;
  image: string;
  user_id: number;
  client_id: number;
  activeDB?: boolean;
}

export interface ProjectCreationAttributes
  extends Optional<ProjectAttributes, "id"> {}

@Table({
  tableName: "project",
  timestamps: true,
  paranoid: true,
})
export class Project extends Model<
  ProjectAttributes,
  ProjectCreationAttributes
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.INTEGER)
  status!: number;

  @Column(DataType.FLOAT)
  revenue!: number;

  @Column(DataType.STRING)
  region!: string;

  @Column(DataType.DATE)
  posting_date!: Date;

  @Column(DataType.DATE)
  exp_closure_date!: Date;

  @Column(DataType.STRING)
  image!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  activeDB?: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @BelongsTo(() => User)
  owner!: User;

  @ForeignKey(() => Client)
  @Column({ type: DataType.INTEGER })
  client_id!: number;

  @BelongsTo(() => Client)
  client!: Client;

  @HasMany(() => JobPosition)
  jobPositions!: JobPosition[];
}
