import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";

import { Optional } from "sequelize";
import { Opening } from "./opening";
import { Project } from "./project";

// Asumiendo que Exclusivity y DemandCuration son enums o tipos definidos anteriormente
export enum Exclusivity {
  Committed = "Committed",
  NonCommitted = "NonCommitted",
}

export enum DemandCuration {
  Strategic = "Strategic",
  Committed = "Committed",
  Open = "Open",
}

interface JobPositionAttributes {
  id: number;
  name: string;
  bill_rate: number;
  posting_type: string;
  division: string;
  skills_position: string[];
  region: string;
  exclusivity: Exclusivity;
  demand_curation: DemandCuration;
  cross_division: boolean;
  openings_list: Opening[];
  project_id: number; 
  project: Project; 
  image_url: string;
  // So we can use soft delete
  activeDB: boolean;
}

export interface JobPositionCreationAttributes
  extends Optional<JobPositionAttributes, "id" | "activeDB" | "openings_list" | "project"> {}

@Table({
  tableName: "job_position",
  timestamps: true,
  paranoid: true,
})
export class JobPosition extends Model<
  JobPositionAttributes,
  JobPositionCreationAttributes
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  bill_rate!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  posting_type!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  division!: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  skills_position?: string[];

  @Column({ type: DataType.STRING, allowNull: true })
  region?: string;

  @Column({
    type: DataType.ENUM(...Object.values(Exclusivity)),
    allowNull: false,
  })
  exclusivity!: Exclusivity;

  @Column({
    type: DataType.ENUM(...Object.values(DemandCuration)),
    allowNull: false,
  })
  demand_curation!: DemandCuration;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  cross_division!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  image_url?: string;

  @HasMany(() => Opening)
  openings_list!: Opening[];

  // Foreign key project
  @ForeignKey(() => Project)
  @Column(DataType.INTEGER)
  project_id!: number;

  // has one project
  @BelongsTo(() => Project)
  project!: Project;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt?: Date;

  // Para el manejo de borrado suave
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  activeDB?: boolean;
}