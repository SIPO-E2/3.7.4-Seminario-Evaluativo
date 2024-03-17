import { Request, Response } from "express";
import { JobPosition } from "../models/jobPosition";
import { JobPositionCreationAttributes } from "../models/jobPosition";

// Get all job positions
export const getAllJobPositions = async (req: Request, res: Response) => {
  // We add this so we can use the query parameters to paginate the results of the job positions
  // Example: /job-positions?from=0&limit=5
  const { from = 0, to = 5 } = req.query;

  await JobPosition.findAll({ offset: Number(from), limit: Number(to) })
    .then((jobPosition) => {
      res.json({
        status: "success",
        message: " All job positions found",
        data: jobPosition,
      });
    })
    .catch((e) => {
      res.json({
        status: "error",
        message: "All job positions not found",
        error: e,
      });
    });
};

// Get job position by id
export const getJobPositionById = async (req: Request, res: Response) => {
  // We get the id from the request parameters, we get it from the URL
  const { id } = req.params;

  // We use the method findByPk to find the job position by its id
  await JobPosition.findByPk(id)
    .then((jobPosition) => {
      // We wrtite the response in JSON format
      res.json({
        status: "success",
        message: "Job position found",
        data: jobPosition,
      });
    })
    .catch((e) => {
      res.json({
        status: "error",
        message: "Job position not found",
        error: e,
      });
    });
};

// Create a new job position
export const createJobPosition = async (req: Request, res: Response) => {
  // We get the data from the request body
  const {
    name,
    bill_rate,
    posting_type,
    division,
    skills_position,
    region,
    exclusivity,
    demand_curation,
    cross_division,
    image_url,
  } = req.body;

  // We create a new job position with the data from the request body
  await JobPosition.create({
    name,
    bill_rate,
    posting_type,
    division,
    skills_position,
    region,
    exclusivity,
    demand_curation,
    cross_division,
    image_url,
  })
    .then((jobPosition) => {
      res.json({
        status: "success",
        message: "Job position created",
        data: jobPosition,
      });
    })
    .catch((e) => {
      res.json({
        status: "error",
        message: "Job position not created",
        error: e,
      });
    });
};

// Update a job position
export const updateJobPosition = async (req: Request, res: Response) => {
  // We get the id from the request parameters, we get it from the URL
  const { id } = req.params;
  // We get the data from the request body
  const {
    name,
    bill_rate,
    posting_type,
    division,
    skills_position,
    region,
    exclusivity,
    demand_curation,
    cross_division,
    image_url,
  } = req.body;

  try {
    // We use the method update to update the job position by its id
    // updateCount is the number of updated rows
    const [updateCount] = await JobPosition.update(
      {
        name,
        bill_rate,
        posting_type,
        division,
        skills_position,
        region,
        exclusivity,
        demand_curation,
        cross_division,
        image_url,
      },
      { where: { ID: id } } // Ensure this ID matches your database column name, Sequelize is case-sensitive
    );

    // If no rows were updated, return an error
    if (updateCount === 0) {
      return res.json({
        status: "error",
        message: "Job position not found or no data updated",
      });
    }

    // After successfully updating, fetch and return the updated job position
    const updatedJobPosition = await JobPosition.findByPk(id);
    if (!updatedJobPosition) {
      return res.json({
        status: "error",
        message: "Job position not found",
      });
    }

    res.json({
      status: "success",
      message: "Job position updated",
      data: updatedJobPosition,
    });
  } catch (e) {
    res.json({
      status: "error",
      message: "Job position not updated",
      error: e,
    });
  }
};

// Soft Delete to job position
export const deleteJobPosition = async (req: Request, res: Response) => {
  // We get the id from the request parameters, we get it from the URL
  const { id } = req.params;

  // The { where: { ID: id } } is to make sure this matches the model's column name for the ID
  // And also {activeDB: false} is to make sure that the job position is not active
  // update returns an array with two elements, the number of affected rows and the affected rows
  // In here we are using soft delete, so we are not deleting the job position from the db
  // This returns a promise, so we use then and catch to handle the result of the promise
  JobPosition.update(
    { activeDB: false },
    { where: { ID: id } } // To make sure this matches the model's column name for the ID
  )

    // affectedRows has how many rows were affected (updayted) by the query. If affectedRows is greater than 0, it means
    // the update operation did indeed modify one (in this case is mostly 1) or more rows. If affectedRows is 0, it means no rows were updated,
    //which could happen if the conditions in the where clause didn't match any rows.
    .then(([affectedRows]) => {
      if (affectedRows === 0) {
        return res.status(404).json({
          status: "error",
          message: "Job position not found",
        });
      }
      res.json({
        status: "success",
        message: "Job position deleted",
        affectedRows: affectedRows,
      });
    })
    .catch((e) => {
      res.status(500).json({
        status: "error",
        message: "Job position not deleted",
        error: e.toString(),
      });
    });
};