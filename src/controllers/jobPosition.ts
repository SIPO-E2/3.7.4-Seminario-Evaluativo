import { Request, Response } from "express";
import {
  JobPosition,
  JobPositionCreationAttributes,
  Exclusivity,
  DemandCuration,
} from "../models/jobPosition";
import { Client } from "../models/client"; // Asegúrate de tener un modelo para Client

// Función para determinar DemandCuration basado en las reglas proporcionadas
const determineDemandCuration = async (
  clientId: string,
  exclusivity: Exclusivity
): Promise<DemandCuration> => {
  const client = await Client.findByPk(clientId);

  if (!client) {
    throw new Error("Client not found");
  }

  if (client.high_growth && exclusivity === Exclusivity.Committed) {
    return DemandCuration.Strategic;
  } else if (!client.high_growth && exclusivity === Exclusivity.Committed) {
    return DemandCuration.Committed;
  } else if (!client.high_growth && exclusivity === Exclusivity.NonCommitted) {
    return DemandCuration.Open;
  }

  // Valor por defecto o manejo de casos no contemplados
  return DemandCuration.Open;
};

// Ejemplo de uso en una ruta de Express para crear un JobPosition
export const createJobPosition = async (req: Request, res: Response) => {
  try {
    // Asume que el body ya contiene todos los atributos necesarios excepto demand_curation
    const { client_id, exclusivity, ...restOfAttributes } = req.body;

    const demandCuration = await determineDemandCuration(
      client_id,
      exclusivity
    );

    const jobPosition = await JobPosition.create({
      ...restOfAttributes,
      client_id,
      exclusivity,
      demand_curation: demandCuration,
    });

    res.json({
      status: "success",
      message: "Job position created successfully",
      data: jobPosition,
    });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      status: "error",
      message: errorMessage,
    });
  }
};

export const getAllJobPositions = async (req: Request, res: Response) => {
  const limit = req.query.limit
    ? parseInt(req.query.limit as string)
    : undefined; // Si no se proporciona 'limit', será 'undefined'
  const offset = req.query.offset
    ? parseInt(req.query.offset as string)
    : undefined; // Si no se proporciona 'offset', será 'undefined'

  try {
    const jobPositions = await JobPosition.findAll({
      ...(limit && { limit }), // Incluye 'limit' solo si se especifica
      ...(offset && { offset }), // Incluye 'offset' solo si se especifica
    });
    res.json({
      status: "success",
      message: "All job positions found",
      data: jobPositions,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error fetching job positions",
      error: e,
    });
  }
};

// Get job position by id
export const getJobPositionById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid job position ID",
    });
  }

  try {
    const jobPosition = await JobPosition.findByPk(id);
    if (!jobPosition) {
      return res.status(404).json({
        status: "error",
        message: "Job position not found",
      });
    }
    res.json({
      status: "success",
      message: "Job position found",
      data: jobPosition,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error fetching job position",
      error: e,
    });
  }
};

// Update a job position
export const updateJobPosition = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid job position ID",
    });
  }

  try {
    // Aquí se puede incluir lógica para verificar si `exclusivity` o alguna otra propiedad relevante ha cambiado
    // y, por lo tanto, se necesita recalcula `demand_curation`.
    const existingJobPosition = await JobPosition.findByPk(id);
    if (!existingJobPosition) {
      return res
        .status(404)
        .json({ status: "error", message: "Job position not found" });
    }

    const { exclusivity, client_id } = req.body;

    let demandCuration;
    if (exclusivity && client_id) {
      demandCuration = await determineDemandCuration(client_id, exclusivity);
    }

    await JobPosition.update(
      { ...req.body, demand_curation: demandCuration },
      { where: { id } }
    );

    const updatedJobPosition = await JobPosition.findByPk(id);
    res.json({
      status: "success",
      message: "Job position updated",
      data: updatedJobPosition,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: "error",
      message: "Error updating job position",
      error: e,
    });
  }
};

// Soft Delete a job position
export const deleteJobPosition = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid job position ID",
    });
  }

  try {
    await JobPosition.update({ activeDB: false }, { where: { id } });
    res.json({
      status: "success",
      message: "Job position deleted",
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error deleting job position",
      error: e,
    });
  }
};
