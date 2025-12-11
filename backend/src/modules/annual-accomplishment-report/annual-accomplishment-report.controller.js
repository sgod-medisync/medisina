import annualAccomplishmentReportService from "./annual-accomplishment-report.service.js";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import ApiError from "#utils/ApiError.js";
import { extractAuditInfo, g, getTemplatePath } from '#utils/helpers.js';
import ExcelJS from "exceljs";
import { checkAge } from "#utils/customValidation.js";

export const createReport = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);

  const reportData = {
    ...req.body,
    createdBy: auditInfo.personnelId
  };

  const createdReport = await annualAccomplishmentReportService.createReport(reportData);

  return res.status(StatusCodes.CREATED).json({
    message: 'Annual accomplishment report created successfully',
    data: createdReport
  });
});

export const getReportById = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    throw new ApiError("Report ID is required", StatusCodes.BAD_REQUEST);
  }

  const report = await annualAccomplishmentReportService.getReportById(reportId);

  return res.status(StatusCodes.OK).json({
    data: report
  });
});

export const getReportBySchoolAndYear = asyncHandler(async (req, res) => {
  const { schoolIdNo, schoolYear } = req.params;

  if (!schoolIdNo || !schoolYear) {
    throw new ApiError("School ID and School Year are required", StatusCodes.BAD_REQUEST);
  }

  const report = await annualAccomplishmentReportService.getReportBySchoolAndYear(schoolIdNo, schoolYear);

  return res.status(StatusCodes.OK).json({
    data: report
  });
});

export const updateReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const auditInfo = extractAuditInfo(req.user);

  if (!reportId) {
    throw new ApiError("Report ID is required", StatusCodes.BAD_REQUEST);
  }

  const updateData = {
    ...req.body,
    updatedBy: auditInfo.personnelId
  };

  const updatedReport = await annualAccomplishmentReportService.updateReport(reportId, updateData);

  return res.status(StatusCodes.OK).json({
    message: 'Report updated successfully',
    data: updatedReport
  });
});

export const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const auditInfo = extractAuditInfo(req.user);

  if (!reportId) {
    throw new ApiError("Report ID is required", StatusCodes.BAD_REQUEST);
  }

  await annualAccomplishmentReportService.deleteReport(reportId, auditInfo.personnelId);

  return res.status(StatusCodes.OK).json({
    message: 'Report deleted successfully'
  });
});

export const getAllReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, region, division, schoolYear, schoolName } = req.query;
  const auditInfo = extractAuditInfo(req.user)
  const filters = {};
  if (region) filters.region = region;
  if (division) filters.division = division;
  if (schoolYear) filters.schoolYear = schoolYear;
  if (schoolName) filters.schoolName = { $regex: schoolName, $options: 'i' };

  const result = await annualAccomplishmentReportService.getAllReports(page, limit, filters, auditInfo.personnelId);

  return res.status(StatusCodes.OK).json({
    data: result.reports,
  });
})

export const getReportsBySchoolYear = asyncHandler(async (req, res) => {
  const { schoolYear } = req.params;

  if (!schoolYear) {
    throw new ApiError("School Year is required", StatusCodes.BAD_REQUEST);
  }

  const reports = await annualAccomplishmentReportService.getReportsBySchoolYear(schoolYear);

  return res.status(StatusCodes.OK).json({
    data: reports
  });
});

export const getReportsByRegionDivision = asyncHandler(async (req, res) => {
  const { region, division } = req.params;

  if (!region || !division) {
    throw new ApiError("Region and Division are required", StatusCodes.BAD_REQUEST);
  }

  const reports = await annualAccomplishmentReportService.getReportsByRegionDivision(region, division);


  return res.status(StatusCodes.OK).json({
    data: reports
  });
});

export const getReportsBySchoolName = asyncHandler(async (req, res) => {
  const { schoolName } = req.query;

  if (!schoolName) {
    throw new ApiError("School name is required", StatusCodes.BAD_REQUEST);
  }

  const reports = await annualAccomplishmentReportService.getReportsBySchoolName(schoolName);

  return res.status(StatusCodes.OK).json({
    data: reports
  });
});

export const searchReports = asyncHandler(async (req, res) => {
  const { q: query, limit = 20 } = req.query;

  if (!query) {
    throw new ApiError("Search query is required", StatusCodes.BAD_REQUEST);
  }

  const reports = await annualAccomplishmentReportService.searchReports(query, limit);

  return res.status(StatusCodes.OK).json({
    data: reports
  });
});

export const getReportsStatistics = asyncHandler(async (req, res) => {
  const stats = await annualAccomplishmentReportService.getReportsStatistics();

  return res.status(StatusCodes.OK).json({
    data: stats
  });
});

export const getHealthServicesAnalytics = asyncHandler(async (req, res) => {
  const { region, division, schoolYear } = req.query;

  const filters = {};
  if (region) filters.region = region;
  if (division) filters.division = division;
  if (schoolYear) filters.schoolYear = schoolYear;

  const analytics = await annualAccomplishmentReportService.getHealthServicesAnalytics(filters);

  return res.status(StatusCodes.OK).json({
    data: analytics
  });
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);

  const summary = await annualAccomplishmentReportService.getDashboardSummary(auditInfo.personnelId);

  return res.status(StatusCodes.OK).json({
    data: summary
  });
});

export const getHealthProfileStatistics = asyncHandler(async (req, res) => {
  const { schoolId, schoolYear } = req.params;

  if (!schoolId || !schoolYear) {
    throw new ApiError("School ID and School Year are required", StatusCodes.BAD_REQUEST);
  }

  const statistics = await annualAccomplishmentReportService.getHealthProfileStatisticsBySchool(
    schoolId,
    schoolYear,
    false,
    null
  );
  return res.status(StatusCodes.OK).json({
    data: statistics
  });
});



export const exportRecords = asyncHandler(async (req, res) => {
  const templatePath = getTemplatePath("ANNUAL HEALTH SERVICES ACCOMPLISHMENT REPORT.xlsx");


  const { reportId } = req.params;
  if (!reportId) return res.status(400).json({ message: 'Missing report id' });

  const report = await annualAccomplishmentReportService.getReportById(reportId);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templatePath);
  const ws = workbook.getWorksheet(1);

  const cell = (c, v) => { ws.getCell(c).value = v ?? ''; };

  cell('B4', g(report, 'region', ''));
  cell('B5', g(report, 'division', ''));
  cell('B8', g(report, 'schoolYear', ''));
  cell('C10', g(report, 'schoolName', ''));
  cell('L10', g(report, 'schoolIdNo', ''));

  cell('C12', g(report, 'totalElemSchoolsVisited', 0));
  cell('C13', g(report, 'totalSecSchoolsVisited', 0));

  cell('D17', g(report, 'generalInformation.schoolEnrollment.male', 0));
  cell('D18', g(report, 'generalInformation.schoolEnrollment.female', 0));


  cell('E21', g(report, 'generalInformation.schoolPersonnel.teaching.male', 0));
  cell('E22', g(report, 'generalInformation.schoolPersonnel.teaching.female', 0));
  cell('E24', g(report, 'generalInformation.schoolPersonnel.nonTeaching.male', 0));
  cell('E25', g(report, 'generalInformation.schoolPersonnel.nonTeaching.female', 0));


  cell('E29', g(report, 'healthServices.healthAppraisal.assessed.learners', 0));
  cell('E30', g(report, 'healthServices.healthAppraisal.assessed.teachers', 0));
  cell('E31', g(report, 'healthServices.healthAppraisal.assessed.ntp', 0));
  cell('E33', g(report, 'healthServices.healthAppraisal.withHealthProblems.learners', 0));
  cell('E34', g(report, 'healthServices.healthAppraisal.withHealthProblems.teachers', 0));
  cell('E35', g(report, 'healthServices.healthAppraisal.withHealthProblems.ntp', 0));
  cell('D36', g(report, 'healthServices.healthAppraisal.visionScreening.learners', 0));

  cell('E38', g(report, 'healthServices.treatmentDone.learners', 0));
  cell('E39', g(report, 'healthServices.treatmentDone.teachers', 0));
  cell('E40', g(report, 'healthServices.treatmentDone.ntp', 0));

  cell('E42', g(report, 'healthServices.pupilsDewormed.firstRound', 0));
  cell('E43', g(report, 'healthServices.pupilsDewormed.secondRound', 0));

  cell('C44', g(report, 'healthServices.pupilsGivenIronSupplement', 0));
  cell('C45', g(report, 'healthServices.pupilsImmunized.count', 0));
  cell('D45', g(report, 'healthServices.pupilsImmunized.vaccineSpecified', ''));

  cell('D47', g(report, 'healthServices.consultationAttended.learners', 0));
  cell('D48', g(report, 'healthServices.consultationAttended.teachers', 0));
  cell('D49', g(report, 'healthServices.consultationAttended.ntp', 0));

  cell('D51', g(report, 'healthServices.referral.physician', 0));
  cell('D52', g(report, 'healthServices.referral.dentist', 0));
  cell('D53', g(report, 'healthServices.referral.guidance', 0));
  cell('D54', g(report, 'healthServices.referral.otherFacilities', 0));
  cell('D55', g(report, 'healthServices.referral.rhuDistrictProvincialHospital', 0));

  cell('C57', g(report, 'healthEducation.classesGivenHealthLectures', 0));
  cell('D59', g(report, 'healthEducation.orientationTraining.learners', 0));
  cell('D60', g(report, 'healthEducation.orientationTraining.teachers', 0));
  cell('D61', g(report, 'healthEducation.orientationTraining.parents', 0));
  cell('D62', g(report, 'healthEducation.orientationTraining.others.count', 0));
  cell('E62', g(report, 'healthEducation.orientationTraining.others.specify', ''));

  cell('D64', g(report, 'healthEducation.conferenceMeeting.teachersAdministrators', 0));
  cell('D65', g(report, 'healthEducation.conferenceMeeting.healthOfficials', 0));
  cell('D66', g(report, 'healthEducation.conferenceMeeting.learners', 0));
  cell('D67', g(report, 'healthEducation.conferenceMeeting.parents', 0));
  cell('D68', g(report, 'healthEducation.conferenceMeeting.lguBarangay', 0));
  cell('D69', g(report, 'healthEducation.conferenceMeeting.ngoStakeholders', 0));

  cell('D71', g(report, 'healthEducation.involvementAsResourcePerson.healthActivitiesPrograms', 0));
  cell('D72', g(report, 'healthEducation.involvementAsResourcePerson.classDiscussion', 0));
  cell('D73', g(report, 'healthEducation.involvementAsResourcePerson.healthClubsOrganization', 0));

  cell('C75', g(report, 'schoolCommunityActivities.ptaHomeroomMeetings', 0));
  cell('C76', g(report, 'schoolCommunityActivities.parentEducationSeminar', 0));
  cell('C77', g(report, 'schoolCommunityActivities.homeVisitsConducted', 0));
  cell('C78', g(report, 'schoolCommunityActivities.hospitalVisitsMade', 0));

  cell('D81', g(report, 'commonSignsSymptoms.skinAndScalp.pediculosis', 0));
  cell('D82', g(report, 'commonSignsSymptoms.skinAndScalp.rednessOfSkin', 0));
  cell('D83', g(report, 'commonSignsSymptoms.skinAndScalp.whiteSpots', 0));
  cell('D84', g(report, 'commonSignsSymptoms.skinAndScalp.flakySkin', 0));
  cell('D85', g(report, 'commonSignsSymptoms.skinAndScalp.minorInjuries', 0));
  cell('D86', g(report, 'commonSignsSymptoms.skinAndScalp.impetigoBoil', 0));
  cell('D87', g(report, 'commonSignsSymptoms.skinAndScalp.skinLesions', 0));
  cell('D88', g(report, 'commonSignsSymptoms.skinAndScalp.acnePimples', 0));
  cell('D89', g(report, 'commonSignsSymptoms.skinAndScalp.itchiness', 0));

  cell('D91', g(report, 'commonSignsSymptoms.eyeAndEars.mattedEyelashes', 0));
  cell('D92', g(report, 'commonSignsSymptoms.eyeAndEars.eyeRedness', 0));
  cell('D93', g(report, 'commonSignsSymptoms.eyeAndEars.ocularMisalignment', 0));
  cell('D94', g(report, 'commonSignsSymptoms.eyeAndEars.eyeDischarge', 0));
  cell('D95', g(report, 'commonSignsSymptoms.eyeAndEars.paleConjunctiva', 0));
  cell('D96', g(report, 'commonSignsSymptoms.eyeAndEars.hordeolum', 0));
  cell('D97', g(report, 'commonSignsSymptoms.eyeAndEars.earDischarge', 0));
  cell('D98', g(report, 'commonSignsSymptoms.eyeAndEars.mucusDischarge', 0));
  cell('D99', g(report, 'commonSignsSymptoms.eyeAndEars.noseBleeding', 0));

  cell('D101', g(report, 'commonSignsSymptoms.mouthNeckThroat.presenceOfLesions', 0));
  cell('D102', g(report, 'commonSignsSymptoms.mouthNeckThroat.inflamedPharynx', 0));
  cell('D103', g(report, 'commonSignsSymptoms.mouthNeckThroat.enlargedTonsils', 0));
  cell('D104', g(report, 'commonSignsSymptoms.mouthNeckThroat.enlargedLymphnodes', 0));

  cell('D106', g(report, 'commonSignsSymptoms.heartAndLungs.rates', 0));
  cell('D107', g(report, 'commonSignsSymptoms.heartAndLungs.murmur', 0));
  cell('D108', g(report, 'commonSignsSymptoms.heartAndLungs.irregularHeartRate', 0));
  cell('D109', g(report, 'commonSignsSymptoms.heartAndLungs.wheezes', 0));

  cell('D111', g(report, 'commonSignsSymptoms.deformities.acquired.count', 0));
  cell('E111', g(report, 'commonSignsSymptoms.deformities.acquired.specify', ''));
  cell('D112', g(report, 'commonSignsSymptoms.deformities.congenital.count', 0));
  cell('E112', g(report, 'commonSignsSymptoms.deformities.congenital.specify', ''));

  cell('C114', 'a. Normal');
  cell('D114', g(report, 'commonSignsSymptoms.nutritionalStatus.normal', 0));
  cell('C115', 'b. Wasted');
  cell('D115', g(report, 'commonSignsSymptoms.nutritionalStatus.wasted', 0));
  cell('C116', 'c. Severly Wasted');
  cell('D116', g(report, 'commonSignsSymptoms.nutritionalStatus.severelyWasted', 0));
  cell('C117', 'd. Obeese');
  cell('D117', g(report, 'commonSignsSymptoms.nutritionalStatus.obese', 0));
  cell('C118', 'e. Overweight');
  cell('D118', g(report, 'commonSignsSymptoms.nutritionalStatus.overweight', 0));
  cell('C119', 'f. Stunted');
  cell('D119', g(report, 'commonSignsSymptoms.nutritionalStatus.stunted', 0));
  cell('C120', 'g. Tall');
  cell('D120', g(report, 'commonSignsSymptoms.nutritionalStatus.tall', 0));

  cell('D122', g(report, 'commonSignsSymptoms.abdomen.abdominalPain', 0));
  cell('D123', g(report, 'commonSignsSymptoms.abdomen.distended', 0));
  cell('D124', g(report, 'commonSignsSymptoms.abdomen.tenderness', 0));
  cell('D125', g(report, 'commonSignsSymptoms.abdomen.dysmenorrhea', 0));

  cell('D128', g(report, 'commonSignsSymptoms.dentalService.gingivitis', 0));
  cell('D129', g(report, 'commonSignsSymptoms.dentalService.periodontalDisease', 0));
  cell('D130', g(report, 'commonSignsSymptoms.dentalService.malocclusion', 0));
  cell('D131', g(report, 'commonSignsSymptoms.dentalService.supernumeraryTeeth', 0));
  cell('D132', g(report, 'commonSignsSymptoms.dentalService.retainedDecidousTeeth', 0));
  cell('D133', g(report, 'commonSignsSymptoms.dentalService.decubitalUlcer', 0));
  cell('D134', g(report, 'commonSignsSymptoms.dentalService.calculus', 0));
  cell('D135', g(report, 'commonSignsSymptoms.dentalService.cleftLipPalate', 0));
  cell('D136', g(report, 'commonSignsSymptoms.dentalService.fluorosis', 0));
  cell('D137', g(report, 'commonSignsSymptoms.dentalService.others.count', 0));
  cell('E137', g(report, 'commonSignsSymptoms.dentalService.others.specify', ''));
  cell('D138', g(report, 'commonSignsSymptoms.dentalService.totalDMFT', 0));
  cell('D139', g(report, 'commonSignsSymptoms.dentalService.totalDmft', 0));


  if (Array.isArray(g(report, 'commonSignsSymptoms.otherSignsSymptoms', []))) {
    const otherArr = g(report, 'commonSignsSymptoms.otherSignsSymptoms', []);
    otherArr.slice(0, 10).forEach((txt, idx) => {
      cell(`C${140 + idx}`, txt || '');
    });
  }

  cell('B150', g(report, 'remarks', ''));


  cell('B158', `${g(report, 'signatures.preparedBy.name', '')} / ${g(report, 'signatures.preparedBy.designation', '')}`);

  // Set column widths
  ws.getColumn('A').width = 5;
  ws.getColumn('B').width = 30;
  ws.getColumn('C').width = 35;
  ws.getColumn('D').width = 15;
  ws.getColumn('E').width = 15;
  ws.getColumn('F').width = 25;
  ws.getColumn('G').width = 15;
  ws.getColumn('H').width = 15;
  ws.getColumn('I').width = 15;
  ws.getColumn('J').width = 15;
  ws.getColumn('K').width = 15;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="AAR-${report.schoolIdNo || 'report'}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();

})