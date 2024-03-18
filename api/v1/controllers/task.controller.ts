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

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const status: string = req.body.status;

    await Task.updateOne({ _id: id }, { status: status });

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }
}

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids;
    const key: string = req.body.key;
    const value: string = req.body.value;

    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );

        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }
};

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: data
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    await Task.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
};