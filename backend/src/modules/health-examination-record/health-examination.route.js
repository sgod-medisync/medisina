import express from "express";
import { auth } from "#middleware/auth.js";
import validate from '#middleware/validateRequests.js';
import * as healthExaminationController from "./health-examination.controller.js";
import {
  createHealthExaminationSchema, updateHealthExaminationSchema, getHealthExaminationByIdSchema, bulkDeleteSchema, searchQuerySchema, dateRangeQuerySchema, priorityParamSchema, divisionParamSchema, departmentParamSchema, approvalSchema
} from "./health-examination.validation.js";

const router = express.Router();

router.route('/').post(auth('Doctor', 'Admin', 'Nurse'), validate({ body: createHealthExaminationSchema }), healthExaminationController.createHealthExamination).get(auth('Admin', 'Doctor'), healthExaminationController.fetchAllHealthExaminations);

router.route('/my-records').get(auth('Doctor', 'Admin', 'Nurse','Teacher'), healthExaminationController.fetchMyHealthExaminations);

router.route('/search').get(auth('Doctor', 'Admin', 'Nurse'), validate({ query: searchQuerySchema }), healthExaminationController.searchByName);

router.route('/stats/count').get(auth('Doctor', 'Admin', 'Nurse'), healthExaminationController.getHealthExaminationCount);


router.route('/follow-ups/pending').get(auth('Doctor', 'Admin', 'Nurse'), healthExaminationController.getPendingFollowUps);

router.route('/date-range').get(auth('Doctor', 'Admin', 'Nurse'), validate({ query: dateRangeQuerySchema }), healthExaminationController.getRecordsByDateRange);


router.route('/stats/division/:division').get(auth('Admin', 'Doctor'), validate({ params: divisionParamSchema }), healthExaminationController.getStatsByDivision);


router.route('/stats/department/:department').get(auth('Admin', 'Doctor'), validate({ params: departmentParamSchema }), healthExaminationController.getStatsByDepartment);


router.route('/priority/:priority').get(auth('Doctor', 'Admin', 'Nurse'), validate({ params: priorityParamSchema }), healthExaminationController.getRecordsByPriority);


router.route('/bulk').delete(auth('Doctor', 'Admin', 'Nurse'), validate({ body: bulkDeleteSchema }), healthExaminationController.bulkDeleteHealthExaminations);


router.route('/:heId')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema }), healthExaminationController.getHealthExaminationById)
  .put(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema, body: updateHealthExaminationSchema }), healthExaminationController.updateHealthExaminationById)
  .patch(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema, body: updateHealthExaminationSchema }), healthExaminationController.updateHealthExaminationById)
  .delete(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema }), healthExaminationController.deleteHealthExaminationById);

router.route('/:heId/export')
  .get(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema }), healthExaminationController.exportHealthExamination);

router.route('/:heId/restore')
  .post(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema }), healthExaminationController.restoreHealthExamination);


router.route('/:heId/complete')
  .post(auth('Doctor', 'Admin', 'Nurse'), validate({ params: getHealthExaminationByIdSchema }), healthExaminationController.markAsCompleted);

router.route('/:heId/approve')
  .post(auth('Doctor', 'Admin'), validate({ params: getHealthExaminationByIdSchema, body: approvalSchema }), healthExaminationController.approveHealthExamination);

export default router;
