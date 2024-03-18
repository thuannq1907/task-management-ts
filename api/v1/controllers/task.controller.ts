import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination.helper";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
  const find = {
    deleted: false
  };
  
  if(req.query.status) {
    find["status"] = req.query.status;
  }

  // Sort
  const sort = {};

  if(req.query.sortKey && req.query.sortValue) {
    sort[`${req.query.sortKey}`] = req.query.sortValue;
  }
  // End Sort

  // Pagination
  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(2, req.query, countTasks);
  // End Pagination

  // Search
  if(req.query.keyword) {
    const regex = new RegExp(`${req.query.keyword}`, "i");
    find["title"] = regex;
  }
  // End Search

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination["skip"]);

  res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });

  res.json(task);
}