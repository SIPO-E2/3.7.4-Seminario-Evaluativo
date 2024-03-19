import { Request, Response } from "express";
import { Project } from "../models/project";
import { ProjectCreationAttributes } from "../models/project";
import { User } from "../models/user";
import { Client } from "../models/client";
import { JobPosition } from "../models/jobPosition"; // Importing JobPosition model

// So we can get ALL the projects
export const getProjects = async (req: Request, res: Response) => {
  const { includeJobPositions = "false" } = req.query;
  const options = {
    include: includeJobPositions === "true" ? [JobPosition] : [],
  };
  try {
    const projects = await Project.findAll(options);
    res.json({ status: "success", message: "Projects found", data: projects });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error fetching projects",
      error: e,
    });
  }
};

export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params; // Obtiene el ID del proyecto desde los parámetros de la URL
  const { includeJobPositions = "false" } = req.query; // Obtiene el parámetro de consulta

  try {
    const inclusion = includeJobPositions === "true" ? [JobPosition] : [];
    const project = await Project.findByPk(id, {
      include: inclusion, // Condiciona la inclusión de job_positions
    });

    if (project) {
      res.json({ status: "success", message: "Project found", data: project });
    } else {
      res.status(404).json({ status: "error", message: "Project not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching the project", error });
  }
};

// Crea un nuevo proyecto
export const postProject = async (req: Request, res: Response) => {
  const {
    name,
    status,
    user_id,
    client_id,
    revenue,
    region,
    posting_date,
    exp_closure_date,
    image,
  } = req.body;
  try {
    const newProject = await Project.create({
      name,
      status,
      revenue,
      user_id,
      client_id,
      region,
      posting_date,
      exp_closure_date,
      image,
    });
    res.json({
      status: "success",
      message: "Project created",
      data: newProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error creating project", error });
  }
};

// Updating a project
export const putProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const projectUpdates = req.body;

  try {
    const [updated] = await Project.update(projectUpdates, { where: { id } });
    if (updated) {
      const updatedProject = await Project.findByPk(id);
      res.json({
        status: "success",
        message: "Project updated successfully",
        data: updatedProject,
      });
    } else {
      res.status(404).json({ status: "error", message: "Project not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error updating project", error });
  }
};

// Elimina (borrado suave) un proyecto
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await Project.update(
      { activeDB: false },
      { where: { id } }
    );
    if (deleted) {
      return res.json({ status: "success", message: "Project deleted" });
    }
    res.status(404).json({ status: "error", message: "Project not found" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error deleting project", error });
  }
};
