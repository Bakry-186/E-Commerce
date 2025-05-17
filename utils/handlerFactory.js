import qs from "qs";

import asyncHandler from "express-async-handler";

import ApiError from "./apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Delete specific document
export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ApiError("Document not found!", 404));
    }

    res.status(200).json({ message: "Document deleted successfully!" });
  });

// Update specific document
export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doc) {
      return next(new ApiError("Document not found!", 404));
    }

    doc.save();
    res.status(200).json({ data: doc });
  });

// Create specific document
export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({ data: newDoc });
  });

// Get specific document
export const getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    // Build query
    let query = Model.findById(req.params.id);

    if (populateOpt) {
      query = query.populate(populateOpt);
    }

    const doc = await query;
    if (!doc) {
      return next(new ApiError("Document not found!", 404));
    }

    res.status(200).json({ data: doc });
  });

// Get all documents
export const getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(
      Model.find(filter),
      qs.parse(req._parsedUrl.query)
    )
      .filter()
      .search(modelName)
      .sort()
      .limitFields()
      .paginate(countDocuments);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const docs = await mongooseQuery;

    res.status(200).json({
      result: docs.length,
      paginationResult,
      data: docs,
    });
  });
