import PersonnelHealthCardService from './personnel-health-card.service.js';
import dssService from './personnel-health-card-dss.service.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { extractAuditInfo, getTemplatePath } from '#utils/helpers.js';
import ApiError from '#utils/ApiError.js';
import ExcelJS from 'exceljs';
import fs from 'fs';
import logger from '#logger/logger.js';


export const createHealthCard = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);

  const healthCardData = {
    ...req.body,
    interviewedBy: {
      user: auditInfo.personnelId,
      interviewDate: new Date()
    },

  };
  const data = await PersonnelHealthCardService.createHealthCard(healthCardData);
  return res.status(StatusCodes.CREATED).json({
    message: 'Personnel health card created successfully',
    data,
    interviewedBy: auditInfo.personnelName
  });
});

export const getAllHealthCards = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const auditInfo = extractAuditInfo(req.user);

  const result = await PersonnelHealthCardService.getAllHealthCards(auditInfo.associatedSchools, page, limit);

  return res.status(StatusCodes.OK).json({
    data: result.data,
    pagination: result.pagination,
  });
});
export const getHealthCardCount = asyncHandler(async (req, res) => {
  const count = await PersonnelHealthCardService.getHealthCardCount();
  // if (count.length <= 0) throw new ApiError('No Health Card Record Found', StatusCodes.NOT_FOUND);

  return res.status(StatusCodes.OK).json({
    count,
  });
});

export const getHealthCardById = asyncHandler(async (req, res) => {
  const { phcId } = req.params;
  if (!phcId) throw new ApiError("Health card id is required", StatusCodes.BAD_REQUEST);

  const data = await PersonnelHealthCardService.getHealthCardById(phcId);
  return res.status(StatusCodes.OK).json(data);
});

export const updateHealthCardById = asyncHandler(async (req, res) => {
  const { phcId } = req.params;
  if (!phcId) throw new ApiError("Health card phcId is required", StatusCodes.BAD_REQUEST);

  const data = await PersonnelHealthCardService.updateHealthCardById(phcId, req.body);
  return res.status(StatusCodes.OK).json({
    message: 'Health Card has been updated successfully',
    data
  });
});

export const deleteHealthCardById = asyncHandler(async (req, res) => {
  const { phcId } = req.params;
  if (!phcId) throw new ApiError("Health card phcId is required", StatusCodes.BAD_REQUEST);

  const record = await PersonnelHealthCardService.deleteHealthCardById(phcId);
  return res.status(StatusCodes.OK).json({
    message: 'Health card deleted successfully',
    record
  });
});

export const getHealthCardsByCondition = asyncHandler(async (req, res) => {
  const { condition } = req.params;
  if (!condition) throw new ApiError('Please specify the condition', StatusCodes.BAD_REQUEST);

  const data = await PersonnelHealthCardService.getHealthCardsByCondition(condition);
  return res.status(StatusCodes.OK).json({
    message: `Found ${data.length} records with ${condition}`,
    data
  });
});

export const getHealthCardsByAgeRange = asyncHandler(async (req, res) => {
  const { minAge, maxAge } = req.query;
  if (!minAge || !maxAge) throw new ApiError('Both minAge and maxAge are required', StatusCodes.BAD_REQUEST);

  const data = await PersonnelHealthCardService.getHealthCardsByAgeRange(+minAge, +maxAge);
  return res.status(StatusCodes.OK).json({
    message: `Found ${data.length} records in age range ${minAge}-${maxAge}`,
    data
  });
});

export const getHealthCardsBySymptoms = asyncHandler(async (req, res) => {
  const { symptoms } = req.query;
  if (!symptoms) throw new ApiError('Symptoms are required', StatusCodes.BAD_REQUEST);

  const symptomArray = Array.isArray(symptoms) ? symptoms : symptoms.split(',');
  const data = await PersonnelHealthCardService.getHealthCardsBySymptoms(symptomArray);

  return res.status(StatusCodes.OK).json({
    message: `Found ${data.length} records with specified symptoms`,
    data,
    queriedSymptoms: symptomArray
  });
});

export const getHealthCardsByGender = asyncHandler(async (req, res) => {
  const { gender } = req.query;
  const data = await PersonnelHealthCardService.getHealthCardsByGender(gender);

  return res.status(StatusCodes.OK).json({
    message: 'Health Cards by Gender',
    data
  });
});

export const getRecentHealthCards = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const dayRange = days ? parseInt(days) : 30;
  const auditInfo = extractAuditInfo(req.user)
  const data = await PersonnelHealthCardService.getRecentHealthCards(dayRange, auditInfo.personnelId);
  return res.status(StatusCodes.OK).json({
    message: `Found ${data.length} health cards from the last ${dayRange} days`,
    data
  });
});

export const getHealthSummaryReport = asyncHandler(async (req, res) => {
  const report = await PersonnelHealthCardService.getHealthSummaryReport();
  return res.status(StatusCodes.OK).json({
    message: 'Health summary report generated successfully',
    report
  });
});


export const getHealthCardsByPersonnel = asyncHandler(async (req, res) => {
  const { phcId } = req.params;
  if (!phcId) throw new ApiError('Personnel ID is required', StatusCodes.BAD_REQUEST);

  const data = await PersonnelHealthCardService.getHealthCardsByPersonnel(phcId);
  return res.status(StatusCodes.OK).json({
    message: `Found ${data.length} health cards for personnel ${phcId}`,
    data
  });
});


export const getHealthCardDSSByPersonnel = asyncHandler(async (req, res) => {
  const { phcId } = req.params;
  if (!phcId) throw new ApiError("Personnel ID is required", StatusCodes.BAD_REQUEST);

  const cards = await PersonnelHealthCardService.getHealthCardsByPersonnel(phcId);

  const dssResults = cards.map(card => card.dss);

  return res.status(StatusCodes.OK).json({
    message: 'DSS analysis for personnel health cards',
    data: dssResults,
    totalCards: cards.length
  });
});

export const getHealthCardDSSDashboard = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);
  const result = await PersonnelHealthCardService.getAllHealthCards(auditInfo.associatedSchools);
  const cards = result.data;
  const dashboard = await dssService.personnelHealthDashboard(cards);
  return res.status(StatusCodes.OK).json({
    message: 'Personnel health DSS dashboard',
    data: dashboard,
    totalCards: cards.length
  });
});

export const getPersonnelByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const auditInfo = extractAuditInfo(req.user);

  const validCategories = [
    'hypertension',
    'diabetes',
    'cvd',
    'ptb',
    'smoking',
    'needsClearance',
    'highRisk',
    'mediumRisk',
    'lowRisk',
    'unclassified'
  ];

  if (!validCategories.includes(category)) {
    throw new ApiError(`Invalid category. Valid categories are: ${validCategories.join(', ')}`, StatusCodes.BAD_REQUEST);
  }
  const result = await PersonnelHealthCardService.getAllHealthCards(auditInfo.associatedSchools);
  const cards = result.data;
  const personnel = await dssService.getPersonnelByCategory(cards, category);

  return res.status(StatusCodes.OK).json({
    count: personnel.length,
    category,
    data: personnel
  });
});

export const exportRiskStratificationToExcel = asyncHandler(async (req, res) => {
  const auditInfo = extractAuditInfo(req.user);

  const result = await PersonnelHealthCardService.getAllHealthCards(auditInfo.associatedSchools);
  const cards = result.data;

  // Get personnel data for all risk categories
  const [highRisk, mediumRisk, lowRisk, unclassified] = await Promise.all([
    dssService.getPersonnelByCategory(cards, 'highRisk'),
    dssService.getPersonnelByCategory(cards, 'mediumRisk'),
    dssService.getPersonnelByCategory(cards, 'lowRisk'),
    dssService.getPersonnelByCategory(cards, 'unclassified')
  ]);

  // Combine all personnel with their risk levels
  const allPersonnel = [
    ...highRisk.map(p => ({ ...p, riskLevel: 'High Risk', severity: 'Critical' })),
    ...mediumRisk.map(p => ({ ...p, riskLevel: 'Medium Risk', severity: 'High' })),
    ...lowRisk.map(p => ({ ...p, riskLevel: 'Low Risk', severity: 'Medium' })),
    ...unclassified.map(p => ({ ...p, riskLevel: 'Unclassified', severity: 'Low' }))
  ];

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Risk Stratification');

  // Define columns
  worksheet.columns = [
    { header: 'School Name', key: 'schoolName', width: 30 },
    { header: 'Personnel Name', key: 'personnelName', width: 30 },
    { header: 'Risks Count', key: 'risksCount', width: 15 },
    { header: 'Risks Identified', key: 'risksIdentified', width: 50 },
    { header: 'Risk Level', key: 'riskLevel', width: 20 },
    { header: 'Fitness to Work', key: 'fitnessToWork', width: 25 },
    { header: 'Status', key: 'status', width: 20 }
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  allPersonnel.forEach((person) => {
    const schoolName = person.schoolName?.[0] || 'N/A';
    const personnelName = person.personnelName || 'Unknown';
    const risksCount = person.risksCount || 0;
    const risksIdentified = Array.isArray(person.risksIdentified)
      ? person.risksIdentified.join('; ')
      : (person.risksIdentified || 'No risks identified');
    const riskLevel = person.riskLevel;
    const fitnessToWork = person.fitnessToWork || 'Not Assessed';
    const status = person.severity === 'Critical' ? 'URGENT' : 'Follow-up Required';

    const row = worksheet.addRow({
      schoolName,
      personnelName,
      risksCount,
      risksIdentified,
      riskLevel,
      fitnessToWork,
      status
    });

    // Apply row styling based on severity
    if (person.severity === 'Critical') {
      row.getCell('riskLevel').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }
      };
      row.getCell('riskLevel').font = { color: { argb: 'FFFFFFFF' }, bold: true };
    } else if (person.severity === 'High') {
      row.getCell('riskLevel').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF9800' }
      };
      row.getCell('riskLevel').font = { color: { argb: 'FFFFFFFF' }, bold: true };
    } else if (person.severity === 'Medium') {
      row.getCell('riskLevel').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2196F3' }
      };
      row.getCell('riskLevel').font = { color: { argb: 'FFFFFFFF' }, bold: true };
    }
  });

  // Add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Set response headers
  const fileName = `Personnel_Risk_Stratification_${new Date().toISOString().split('T')[0]}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
});

export const searchPersonnelWithHealthCard = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ApiError("Search query is required", StatusCodes.BAD_REQUEST);

  const data = await PersonnelHealthCardService.searchPersonnelWithHealthCard(q);

  return res.status(StatusCodes.OK).json({
    message: `Found ${data.length} health card(s) for personnel matching "${q}"`,
    data
  });
});

export const generatePrescriptionFromRecord = asyncHandler(async (req, res) => {
  const { phcId } = req.params;
  const prescriptionService = (await import('#modules/prescription/prescription.service.js')).default;

  const prescription = await prescriptionService.autoGeneratePrescriptionFromPersonnelHealth(
    phcId,
    req.user._id
  );

  return res.status(StatusCodes.CREATED).json({
    message: "Prescription auto-generated successfully from personnel health record",
    data: prescription
  });
});

export const exportPersonnelHealthCard = asyncHandler(async (req, res) => {
  const { phcId } = req.params;

  if (!phcId) {
    throw new ApiError("Personnel health card ID is required", StatusCodes.BAD_REQUEST);
  }

  const healthCardData = await PersonnelHealthCardService.getHealthCardById(phcId);

  if (!healthCardData) {
    throw new ApiError("Personnel health card not found", StatusCodes.NOT_FOUND);
  }

  const workbook = new ExcelJS.Workbook();
  const templatePath = getTemplatePath('PERSONNEL HEALTH CARD.xlsx');

  // Check if file exists before trying to read it
  if (!fs.existsSync(templatePath)) {
    logger.error(`Template file not found at path: ${templatePath}`);
    logger.error(`Current working directory: ${process.cwd()}`);
    logger.error(`Directory contents: ${fs.existsSync(process.cwd() + '/templates') ? fs.readdirSync(process.cwd() + '/templates').join(', ') : 'templates directory not found'}`);
    throw new ApiError(`Template file not found: ${templatePath}`, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  try {
    await workbook.xlsx.readFile(templatePath);
  } catch (error) {
    logger.error(`Failed to load personnel health card template: ${error.message}`, { error, templatePath });
    throw new ApiError(`Failed to load personnel health card template: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];

  if (!sheet) {
    throw new ApiError("Template worksheet not found", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const setCellValue = (cell, value) => {
    if (sheet.getCell(cell)) {
      sheet.getCell(cell).value = value || '';
    }
  };

  const setCheckbox = (cellY, cellN, value) => {
    if (value === true) {
      setCellValue(cellY, 'X');
    } else if (value === false) {
      setCellValue(cellN, 'X');
    }
  };

  const personnel = healthCardData.personnel;
  if (personnel) {
    setCellValue('C7', personnel.firstName + personnel.lastName || '');
    setCellValue('F8', personnel.schoolDistrictDivision.toString() || '');
    setCellValue('E9', personnel.position || '');
    setCellValue('E10', personnel.yearsInService || '');

    if (personnel.dateOfBirth) {
      setCellValue('M7', new Date(personnel.dateOfBirth).toLocaleDateString());
    }
    setCellValue('R7', personnel.age || '');

    if (personnel.gender === 'M' || personnel.gender === 'Male') {
      setCellValue('W7', 'X');
    } else if (personnel.gender === 'F' || personnel.gender === 'Female') {
      setCellValue('X7', 'X');
    }

    const civilStatus = personnel.civilStatus?.toUpperCase();
    if (civilStatus === 'SINGLE' || civilStatus === 'S') {
      setCellValue('W8', 'X');
    } else if (civilStatus === 'MARRIED' || civilStatus === 'M') {
      setCellValue('X8', 'X');
    } else if (civilStatus === 'WIDOWED' || civilStatus === 'W') {
      setCellValue('Y8', 'X');
    } else if (civilStatus === 'SEPARATED' || civilStatus === 'S') {
      setCellValue('Z8', 'X');
    }

    setCellValue('X9', personnel.yearsInService || '');
  }

  if (healthCardData.familyHistory) {
    const fh = healthCardData.familyHistory;

    setCheckbox('J12', 'K12', fh.hypertension);
    setCheckbox('J13', 'K13', fh.cardiovascularDisease);
    setCheckbox('J14', 'K14', fh.diabetesMellitus);
    setCheckbox('J15', 'K15', fh.kidneyDisease);
    setCheckbox('J16', 'K16', fh.cancer);
    setCheckbox('J17', 'K17', fh.asthma);
    setCheckbox('J18', 'K18', fh.allergy);
    if (fh.relationships) {
      const relationships = fh.relationships instanceof Map
        ? fh.relationships
        : new Map(Object.entries(fh.relationships || {}));

      setCellValue('O12', relationships.get ? relationships.get('hypertension') : fh.relationships.hypertension || '');
      setCellValue('O13', relationships.get ? relationships.get('cardiovascularDisease') : fh.relationships.cardiovascularDisease || '');
      setCellValue('O14', relationships.get ? relationships.get('diabetesMellitus') : fh.relationships.diabetesMellitus || '');
      setCellValue('O15', relationships.get ? relationships.get('kidneyDisease') : fh.relationships.kidneyDisease || '');
      setCellValue('O16', relationships.get ? relationships.get('cancer') : fh.relationships.cancer || '');
      setCellValue('O17', relationships.get ? relationships.get('asthma') : fh.relationships.diabetesMellasthmaitus || '');
      setCellValue('O18', relationships.get ? relationships.get('allergy') : fh.relationships.allergy || '');


    }

    setCellValue('G19', fh.otherRemarks || '');
  }

  if (healthCardData.pastMedicalHistory) {
    const pmh = healthCardData.pastMedicalHistory;

    setCheckbox('K23', 'L23', pmh.hypertension);
    setCheckbox('K24', 'L24', pmh.asthma);
    setCheckbox('K25', 'L25', pmh.diabetesMellitus);
    setCheckbox('K26', 'L26', pmh.cardiovascularDisease);

    setCellValue('J27', pmh.allergy || '');

    setCheckbox('Y23', 'Z23', pmh.tuberculosis);
    setCheckbox('Y24', 'Z24', pmh.surgicalOperations || '');
    setCheckbox('Y25', 'Z25', pmh.yellowDiscoloration);
    setCheckbox('Y26', 'Z26', pmh.lastHospitalization || '');
    setCellValue('T27', pmh.others || '');

    if (healthCardData.testResults) {
      const tr = healthCardData.testResults;

      // Last Taken Dates
      if (tr.cxrSputum?.lastTakenDate) {
        setCellValue('G29', new Date(tr.cxrSputum.lastTakenDate).toLocaleDateString());
      }
      if (tr.ecg?.lastTakenDate) {
        setCellValue('G30', new Date(tr.ecg.lastTakenDate).toLocaleDateString());
      }
      if (tr.urinalysis?.lastTakenDate) {
        setCellValue('G31', new Date(tr.urinalysis.lastTakenDate).toLocaleDateString());
      }
      if (tr.drugTesting?.lastTakenDate) {
        setCellValue('Q29', new Date(tr.drugTesting.lastTakenDate).toLocaleDateString());
      }
      if (tr.neuropsychiatricExam?.lastTakenDate) {
        setCellValue('Q30', new Date(tr.neuropsychiatricExam.lastTakenDate).toLocaleDateString());
      }
      if (tr.bloodTyping?.lastTakenDate) {
        setCellValue('Q31', new Date(tr.bloodTyping.lastTakenDate).toLocaleDateString());
      }

      setCellValue('J29', tr.cxrSputum?.result || '');
      setCellValue('J30', tr.ecg?.result || '');
      setCellValue('J31', tr.urinalysis?.result || '');
      setCellValue('T29', tr.drugTesting?.result || '');
      setCellValue('T30', tr.neuropsychiatricExam?.result || '');
      setCellValue('T31', tr.bloodTyping?.result || '');

      if (tr.cxrSputum?.resultDate) {
        setCellValue('K29', new Date(tr.cxrSputum.resultDate).toLocaleDateString());
      }
      if (tr.ecg?.resultDate) {
        setCellValue('K30', new Date(tr.ecg.resultDate).toLocaleDateString());
      }
      if (tr.urinalysis?.resultDate) {
        setCellValue('K31', new Date(tr.urinalysis.resultDate).toLocaleDateString());
      }
      if (tr.drugTesting?.resultDate) {
        setCellValue('U29', new Date(tr.drugTesting.resultDate).toLocaleDateString());
      }
      if (tr.neuropsychiatricExam?.resultDate) {
        setCellValue('U30', new Date(tr.neuropsychiatricExam.resultDate).toLocaleDateString());
      }
      if (tr.bloodTyping?.resultDate) {
        setCellValue('U31', new Date(tr.bloodTyping.resultDate).toLocaleDateString());
      }

      if (tr.others?.name) {
        setCellValue('Y29', tr.others.name || '');
        if (tr.others.lastTakenDate) {
          setCellValue('Z30', new Date(tr.others.lastTakenDate).toLocaleDateString());
        }
        setCellValue('Y30', tr.others.result || '');
      }
    }
  }

  if (healthCardData.socialHistory) {
    const sh = healthCardData.socialHistory;

    if (sh.smoking) {
      setCheckbox('F33', 'H33', sh.smoking.status);
      setCellValue('L33', sh.smoking.ageStarted || '');
      setCellValue('R33', sh.smoking.sticksPerDay || '');
    }

    if (sh.alcohol) {
      setCheckbox('F34', 'G34', sh.alcohol.status);
      setCellValue('L34', sh.alcohol.frequency || '');
    }

    setCellValue('R34', sh.foodPreference || '');
  }

  if (healthCardData.obGynHistory && personnel?.gender === 'F') {
    const obgyn = healthCardData.obGynHistory;

    setCellValue('E37', obgyn.menarche || '');
    setCellValue('J37', obgyn.cycle || '');
    setCellValue('P37', obgyn.duration || '');

    if (obgyn.parity) {
      setCellValue('J38', obgyn.parity.F || '');
      setCellValue('K38', obgyn.parity.P || '');
      setCellValue('L38', obgyn.parity.A || '');
      setCellValue('M38', obgyn.parity.L || '');
    }

    if (obgyn.papsmearDone) {
      setCheckbox('J39', 'K39', obgyn.papsmearDone.status);
      setCellValue('Q39', obgyn.papsmearDone.when || '');
    }

    setCheckbox('J40', 'K40', obgyn.selfBreastExamDone);

    if (obgyn.massNoted) {
      setCheckbox('J41', 'K41', obgyn.massNoted.status);
      setCellValue('Q41', obgyn.massNoted.location || '');
    }
  }

  if (healthCardData.maleExamination && personnel?.gender === 'M') {
    const male = healthCardData.maleExamination;

    setCheckbox('J42', 'K42', male.digitalRectalExamDone);
    if (male.examDate) {
      setCellValue('P42', new Date(male.examDate).toLocaleDateString());
    }
    setCellValue('O43', male.result || '');
  }

  // Present Health Status
  if (healthCardData.presentHealthStatus) {
    const phs = healthCardData.presentHealthStatus;

    // Cough is a string field (duration), not checkbox
    setCellValue('E45', phs.cough || '');

    setCheckbox('L46', 'M46', phs.dizziness);
    setCheckbox('L47', 'M47', phs.dyspnea);
    setCheckbox('L48', 'M48', phs.chestBackPain);
    setCheckbox('L49', 'M49', phs.easyFatigability);
    setCheckbox('L50', 'M50', phs.jointExtremityPains);
    setCheckbox('L51', 'M51', phs.blurringOfVision);
    setCheckbox('L52', 'M52', phs.wearingEyeglasses);
    setCheckbox('L53', 'M3', phs.vaginalDischargeBleeding);

    setCheckbox('Y46', 'Z46', phs.lumps);
    setCheckbox('Y47', 'Z47', phs.painfulUrination);
    setCheckbox('Y48', 'Z48', phs.poorLossOfHearing);
    setCheckbox('Y49', 'Z49', phs.syncope);
    setCheckbox('Y50', 'Z50', phs.convulsions);
    setCheckbox('Y51', 'Z51', phs.malaria);
    setCheckbox('Y52', 'Z52', phs.goiter);
    setCheckbox('Y53', 'Z53', phs.anemia);

    setCellValue('H54', phs.dentalStatus || '');
    setCellValue('T54', phs.others || '');
    setCellValue('K55', phs.presentMedications || '');
  }

  if (healthCardData.interviewedBy) {
    if (healthCardData.interviewedBy.interviewDate) {
      setCellValue('Q62', `${healthCardData.interviewedBy.user.firstName} ${healthCardData.interviewedBy.user.lastName}`);
      setCellValue('P63', new Date(healthCardData.interviewedBy.interviewDate).toLocaleDateString());
    }
  }



  const fileName = `Personnel_Health_Card_${personnel?.perId || phcId}_${new Date().toISOString().split('T')[0]}.xlsx`;

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  await workbook.xlsx.write(res);
  res.end();
});
