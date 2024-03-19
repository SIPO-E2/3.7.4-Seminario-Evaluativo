import { Request, Response } from "express";
import { Project } from "../models/project";
import { ProjectCreationAttributes } from "../models/project";
import { User } from "../models/user";
import { Client } from "../models/client";
import { JobPosition } from "../models/jobPosition"; // Importing JobPosition model

// Obtiene todos los proyectos, con opción de incluir posiciones laborales
export const getProjects = async (req: Request, res: Response) => {
  const { from = 0, to = 5, includeJobPositions = "false" } = req.query;
  try {
    const projects = await Project.findAll({
      offset: Number(from),
      limit: Number(to),
      include: includeJobPositions === "true" ? [JobPosition] : [],
    });
    res.json({ status: "success", message: "Projects found", data: projects });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching projects", error });
  }
};

// Obtiene un proyecto específico por ID
export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id, {
      include: [JobPosition],
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }
    res.json({ status: "success", message: "Project found", data: project });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching the project", error });
  }
};

// Crea un nuevo proyecto
export const createProject = async (req: Request, res: Response) => {
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

// Actualiza un proyecto existente
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [updated] = await Project.update(req.body, { where: { id } });
    if (updated) {
      const updatedProject = await Project.findByPk(id);
      return res.json({
        status: "success",
        message: "Project updated",
        data: updatedProject,
      });
    }
    res.status(404).json({ status: "error", message: "Project not found" });
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
