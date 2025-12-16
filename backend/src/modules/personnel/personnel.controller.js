import { StatusCodes } from "http-status-codes";
import asyncHandler from 'express-async-handler';
import personnelService from "./personnel.service.js";
import ApiError from "#utils/ApiError.js";
import { extractAuditInfo } from "#utils/helpers.js";

export const createPersonnel = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user)
  const newPersonnel = await personnelService.createPersonnel(req.body, auditInfo.personnelId);
  return res.status(StatusCodes.CREATED).json(newPersonnel);
})
export const getPersonnelById = asyncHandler(async (req, res) => {
  const { perId } = req.params

  if (!perId) throw new ApiError('perId is required', StatusCodes.BAD_REQUEST)

  const personnel = await personnelService.getPersonnelById(perId);

  if (!personnel) throw new ApiError(`Personnel with Id ${perId} not found`, StatusCodes.NOT_FOUND)

  return res.status(StatusCodes.OK).json(personnel);
})
export const getPersonnelCount = asyncHandler(async (req, res) => {

  const count = await personnelService.getPersonnelCount();


  return res.status(StatusCodes.OK).json(count);
})
export const getPersonnelByName = asyncHandler(async (req, res) => {
  const { q } = req.query
  const personnel = await personnelService.getPersonnelByName(q);

  if (!personnel) throw new ApiError(`Personnel not found`, StatusCodes.NOT_FOUND)

  return res.status(StatusCodes.OK).json(personnel);
})
export const fetchAllPersonnel = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const auditInfo = extractAuditInfo(req.user);


  const result = await personnelService.fetchAllPersonnel(req.user._id, page, limit);
  return res.status(StatusCodes.OK).json(result);
})
export const fetchAllPersonnelByUser = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const auditInfo = extractAuditInfo(req.user)
  const result = await personnelService.fetchAllPersonnelByUser( auditInfo.schoolName, page, limit);

  return res.status(StatusCodes.OK).json(result);
})

export const searchPersonnel = asyncHandler(async (req, res) => {
  const { query, limit = 50, page = 1 } = req.query;
  const auditInfo = extractAuditInfo(req.user);

  const result = await personnelService.searchPersonnel(
    query,
    auditInfo.personnelId,
    auditInfo.schoolDistrictDivision,
    {
      limit: parseInt(limit),
      page: parseInt(page)
    }
  );

  return res.status(StatusCodes.OK).json({
    data: result.personnel,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const updatePersonnelById = asyncHandler(async (req, res) => {
  const { perId } = req.params
  const auditInfo = extractAuditInfo(req.user)
  if (!perId) throw new ApiError('perId is required', StatusCodes.BAD_REQUEST)

  const updatedPersonnel = await personnelService.updatePersonnelById(perId, req.body, auditInfo.personnelId);

  if (!updatedPersonnel) throw new ApiError('Personnel Not Found', StatusCodes.NOT_FOUND)

  return res.status(StatusCodes.OK).json({ message: 'Personnel updated', personnel: updatedPersonnel });
})
export const deletePersonnelById = asyncHandler(async (req, res) => {
  const { perId } = req.params
  const auditInfo = extractAuditInfo(req.user)
  if (!perId) throw new ApiError('perId is required', StatusCodes.BAD_REQUEST)

  const deletedPersonnel = await personnelService.deletePersonnelById(perId, userId);

  if (!deletedPersonnel) throw new ApiError('Personnel Not Found', StatusCodes.NOT_FOUND)
  return res.status(StatusCodes.OK).json({ message: 'Personnel has been deleted successfully' });
})
export const restorePersonnelById = asyncHandler(async (req, res) => {
  const { perId } = req.params
  if (!perId) throw new ApiError('perId is required', StatusCodes.BAD_REQUEST)

  const restoredPersonnel = await personnelService.restorePersonnel(perId);

  if (!restoredPersonnel) throw new ApiError('Personnel Not Found', StatusCodes.NOT_FOUND)

  return res.status(StatusCodes.OK).json({ message: 'Personnel has been restored successfully' });
})

export const getMyPersonnelRecord = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await personnelService.getMyPersonnelRecord(userId);

  if (!result) {
    return res.status(StatusCodes.OK).json({ data: null });
  }

  return res.status(StatusCodes.OK).json({
    message: 'Personnel record with health history retrieved successfully',
    data: result
  });
})

export const getCompletePersonnelHistory = asyncHandler(async (req, res) => {
  const { perId } = req.params;


  if (!perId) throw new ApiError('perId is required', StatusCodes.BAD_REQUEST);

  const history = await personnelService.getCompletePersonnelHistory(perId);


  return res.status(StatusCodes.OK).json({
    message: 'Personnel complete history retrieved successfully',
    data: history
  });
})
