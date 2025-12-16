import express from 'express';
import * as studentController from './student.controller.js';
import { auth } from "#middleware/auth.js";
import { personnelRoles } from '#utils/constants.js';
import validate from '#middleware/validateRequests.js';
import { createStudentSchema, updateStudentSchema, stdIdParam } from './student.validation.js';

const router = express.Router();


router.use(auth(...personnelRoles))
router.route('/')
  .get(studentController.getAllStudentsByAttendingPersonnel)
  .post(validate(createStudentSchema), studentController.createStudent)

router.get('/get-all-students', studentController.getAllStudents)

router.get('/search', studentController.searchStudents);

router.get('/grade-level/:gradeLevel', studentController.getStudentsByGradeLevel);

router.get('/section/:gradeLevel/:section', studentController.getStudentsBySection);

router.get('/sped', studentController.getSPEDStudents);

router.get('/dropout', studentController.getDropoutStudents);

router.get('/attending', studentController.getStudentsByAttendingPersonnel);

router.get('/counts/grade-level', studentController.getStudentsByGradeLevelCount);

router.get('/count', studentController.getStudentCount);

router.get('/:stdId/complete-history', validate({ params: stdIdParam }), studentController.getCompleteStudentHistory);

router.route('/:stdId')
  .get(validate({ params: stdIdParam }), studentController.getStudentById)
  .put(validate({ body: updateStudentSchema }), studentController.updateStudent)
  .delete(validate({ params: stdIdParam }), studentController.deleteStudent);

router.post('/:stdId/restore', validate({ params: stdIdParam }), studentController.restoreStudent);

export default router;
