import Joi from 'joi';

const genderCountValidation = {
  male: Joi.number().integer().min(0).default(0),
  female: Joi.number().integer().min(0).default(0)
};

const enrollmentDetailValidation = {
  kinder: Joi.object(genderCountValidation),
  grade1: Joi.object(genderCountValidation),
  grade2: Joi.object(genderCountValidation),
  grade3: Joi.object(genderCountValidation),
  grade4: Joi.object(genderCountValidation),
  grade5: Joi.object(genderCountValidation),
  grade6: Joi.object(genderCountValidation),
  sped: Joi.object(genderCountValidation)
};

const juniorHighValidation = {
  grade7: Joi.object(genderCountValidation),
  grade8: Joi.object(genderCountValidation),
  grade9: Joi.object(genderCountValidation),
  grade10: Joi.object(genderCountValidation),
  sped: Joi.object(genderCountValidation)
};

const seniorHighValidation = {
  grade11: Joi.object(genderCountValidation),
  grade12: Joi.object(genderCountValidation)
};

const alsValidation = {
  alsLearners: Joi.object(genderCountValidation)
};

const personnelValidation = {
  teaching: Joi.object(genderCountValidation),
  nonTeaching: Joi.object(genderCountValidation)
};

const dropoutReasonsValidation = {
  illness: Joi.object(genderCountValidation),
  poverty: Joi.object(genderCountValidation),
  otherReasons: Joi.object(genderCountValidation)
};

const healthProblemsValidation = {
  healthProblems: Joi.object(genderCountValidation),
  physicalDeformitiesDefects: Joi.array().items(Joi.object({
    description: Joi.string().trim().allow(''),
    count: Joi.object(genderCountValidation)
  }))
};

const treatmentValidation = {
  treatments: Joi.array().items(Joi.object({
    description: Joi.string().trim().allow(''),
    count: Joi.object(genderCountValidation)
  })),
  numberDewormed: Joi.object({
    firstRound: Joi.object({
      count: Joi.object(genderCountValidation),
      date: Joi.date().optional()
    }),
    secondRound: Joi.object({
      count: Joi.object(genderCountValidation),
      date: Joi.date().optional()
    })
  }),
  givenIronSupplement: Joi.object(genderCountValidation),
  referredToOtherFacilities: Joi.object(genderCountValidation)
};

const referralValidation = {
  physicians: Joi.object(genderCountValidation),
  dentist: Joi.object(genderCountValidation),
  nurse: Joi.object(genderCountValidation),
  guidanceCounselors: Joi.object(genderCountValidation),
  others: Joi.object({
    count: Joi.object(genderCountValidation),
    specify: Joi.string().trim().allow('')
  })
};

const signsSymptomValidation = {
  signsSymptoms: Joi.string().required().trim(),
  numberOfCases: Joi.number().integer().min(0).default(0),
  rank: Joi.number().integer().min(1).max(10)
};

const clinicFacilitiesValidation = {
  area: Joi.number().min(0),
  location: Joi.object({
    separateBuilding: Joi.boolean().default(false),
    roomWithinBuilding: Joi.boolean().default(false),
    withinClassroom: Joi.boolean().default(false)
  }),
  provisions: Joi.object({
    toiletInClinic: Joi.boolean().default(false),
    potableWaterSupply: Joi.boolean().default(false),
    medicines: Joi.boolean().default(false),
    weighingScale: Joi.object({
      available: Joi.boolean().default(false),
      specification: Joi.string().trim().allow('')
    }),
    heightStadiometer: Joi.boolean().default(false),
    medicinetreatmentCabinet: Joi.boolean().default(false),
    examinationTableBed: Joi.boolean().default(false),
    footStoolReceptacle: Joi.boolean().default(false),
    dentalChair: Joi.boolean().default(false),
    workingTable: Joi.boolean().default(false),
    treatmentRecords: Joi.boolean().default(false),
    clinicTeacherSchoolNurseAssigned: Joi.boolean().default(false),
    stockCabinet: Joi.boolean().default(false)
  })
};

const toiletFacilitiesValidation = {
  genderSensitiveType: Joi.boolean().default(false),
  numberOfSeatsUrinal: Joi.number().integer().min(0).default(0),
  menstrualHygieneRoom: Joi.boolean().default(false),
  availabilityOfSanitaryPad: Joi.boolean().default(false)
};

const waterSupplyValidation = {
  source: Joi.string().trim().allow(''),
  certificateOfWaterAnalysis: Joi.boolean().default(false)
};

const washingFacilitiesValidation = {
  source: Joi.string().trim().allow(''),
  provisionOfHandwashingSoap: Joi.boolean().default(false)
};

const canteenValidation = {
  sanitaryPermit: Joi.boolean().default(false),
  healthCertificateOfHelpers: Joi.boolean().default(false),
  complianceToDepEdOrder13_2017: Joi.boolean().default(false)
};


const schoolHealthSurveyIdSchema = Joi.string()
  .pattern(/^[a-f\d]{24}$/i)
  .required()
  .messages({
    "string.base": "School Health Survey ID must be a string",
    "string.empty": "School Health Survey ID cannot be empty",
    "string.pattern.base": "Invalid School Health Survey ID format",
    "any.required": "School Health Survey ID is required"
  });
const createSchoolHealthSurvey = Joi.object({
  region: Joi.string().required().trim().messages({
    'string.empty': 'Region is required',
    'any.required': 'Region is required'
  }),
  division: Joi.string().required().trim().messages({
    'string.empty': 'Division is required',
    'any.required': 'Division is required'
  }),
  year: Joi.string().required().trim().messages({
    'string.empty': 'Year is required',
    'any.required': 'Year is required'
  }),
  schoolName: Joi.string().required().trim().messages({
    'string.empty': 'School name is required',
    'any.required': 'School name is required'
  }),
  district: Joi.string().required().trim().messages({
    'string.empty': 'District is required',
    'any.required': 'District is required'
  }),
  address: Joi.string().trim(),
  schoolId: Joi.string().required().trim().messages({
    'string.empty': 'School ID is required',
    'any.required': 'School ID is required'
  }),
  schoolHeadName: Joi.string().required().trim().messages({
    'string.empty': 'School head name is required',
    'any.required': 'School head name is required'
  }),
  contactNumber: Joi.string().trim(),

  generalInformation: Joi.object({
    enrollment: Joi.object({
      elementary: Joi.object(enrollmentDetailValidation),
      juniorHS: Joi.object(juniorHighValidation),
      seniorHS: Joi.object(seniorHighValidation),
      als: Joi.object(alsValidation)
    }),
    schoolPersonnel: Joi.object(personnelValidation),
    dropoutReasons: Joi.object(dropoutReasonsValidation)
  }),

  healthProfile: Joi.object({
    numberExaminedAssessed: Joi.object({
      learners: Joi.object(genderCountValidation),
      teachers: Joi.object(genderCountValidation),
      ntp: Joi.object(genderCountValidation)
    }),
    foundWith: Joi.object(healthProblemsValidation),
    treatment: Joi.object(treatmentValidation),
    referrals: Joi.object(referralValidation),
    commonSignsSymptoms: Joi.object({
      learners: Joi.array().items(Joi.object(signsSymptomValidation)),
      teachingAndNTP: Joi.array().items(Joi.object(signsSymptomValidation))
    })
  }),

  schoolFacilities: Joi.object({
    schoolSiteArea: Joi.number().min(0),
    numberOfBuildings: Joi.number().integer().min(0).default(0),
    numberOfClassrooms: Joi.number().integer().min(0).default(0),
    healthFacilities: Joi.object({
      schoolClinic: Joi.object(clinicFacilitiesValidation),
      schoolToilet: Joi.object(toiletFacilitiesValidation),
      waterSupplyAndDrinkingWater: Joi.object(waterSupplyValidation),
      washingFacilities: Joi.object(washingFacilitiesValidation),
      schoolCanteen: Joi.object(canteenValidation)
    })
  }),

  remarks: Joi.string().trim().allow(''),
  accomplishedBy: Joi.object({
    name: Joi.string().required().trim(),
    designation: Joi.string().required().trim(),
    dateOfSurvey: Joi.date().max('now').required().messages({
      'date.max': 'Survey date cannot be in the future'
    })
  }).required(),

  surveyStatus: Joi.string().valid('draft', 'completed', 'submitted', 'approved').default('draft')
});

const getSchoolHealthSurveys = Joi.object({
  region: Joi.string().trim(),
  division: Joi.string().trim(),
  year: Joi.string().trim(),
  schoolId: Joi.string().trim(),
  surveyStatus: Joi.string().valid('draft', 'completed', 'submitted', 'approved'),
  sortBy: Joi.string(),
  limit: Joi.number().integer().positive(),
  page: Joi.number().integer().positive()
});

const getSchoolHealthSurvey = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema
});

const schoolHealthSurveyId = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema
});

const deleteSchoolHealthSurvey = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema
});

const markSurveyStatus = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema
});

const approveSurvey = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema,
  remarks: Joi.string().trim().max(500).optional().allow('')
});

const rejectSurvey = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema,
  remarks: Joi.string().trim().max(500).required()
    .messages({
      'string.empty': 'Rejection remarks are required',
      'any.required': 'Rejection remarks are required'
    })
});

const updateSchoolHealthSurvey = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema,
  region: Joi.string().trim(),
  division: Joi.string().trim(),
  year: Joi.string().trim(),
  schoolName: Joi.string().trim(),
  district: Joi.string().trim(),
  address: Joi.string().trim(),
  schoolId: Joi.string().trim(),
  schoolHeadName: Joi.string().trim(),
  contactNumber: Joi.string().trim(),

  generalInformation: Joi.object({
    enrollment: Joi.object({
      elementary: Joi.object(enrollmentDetailValidation),
      juniorHS: Joi.object(juniorHighValidation),
      seniorHS: Joi.object(seniorHighValidation),
      als: Joi.object(alsValidation)
    }),
    schoolPersonnel: Joi.object(personnelValidation),
    dropoutReasons: Joi.object(dropoutReasonsValidation)
  }),

  healthProfile: Joi.object({
    numberExaminedAssessed: Joi.object({
      learners: Joi.object(genderCountValidation),
      teachers: Joi.object(genderCountValidation),
      ntp: Joi.object(genderCountValidation)
    }),
    foundWith: Joi.object(healthProblemsValidation),
    treatment: Joi.object(treatmentValidation),
    referrals: Joi.object(referralValidation),
    commonSignsSymptoms: Joi.object({
      learners: Joi.array().items(Joi.object(signsSymptomValidation)),
      teachingAndNTP: Joi.array().items(Joi.object(signsSymptomValidation))
    })
  }),

  schoolFacilities: Joi.object({
    schoolSiteArea: Joi.number().min(0),
    numberOfBuildings: Joi.number().integer().min(0),
    numberOfClassrooms: Joi.number().integer().min(0),
    healthFacilities: Joi.object({
      schoolClinic: Joi.object(clinicFacilitiesValidation),
      schoolToilet: Joi.object(toiletFacilitiesValidation),
      waterSupplyAndDrinkingWater: Joi.object(waterSupplyValidation),
      washingFacilities: Joi.object(washingFacilitiesValidation),
      schoolCanteen: Joi.object(canteenValidation)
    })
  }),

  remarks: Joi.string().trim().allow(''),
  accomplishedBy: Joi.object({
    name: Joi.string().trim(),
    designation: Joi.string().trim(),
    dateOfSurvey: Joi.date().max('now').messages({
      'date.max': 'Survey date cannot be in the future'
    })
  }),

  surveyStatus: Joi.string().valid('draft', 'completed', 'submitted', 'approved')
}).min(1);



const getSchoolHealthSurveysByYear = Joi.object({
  year: Joi.string().required().messages({
    'string.empty': 'Year is required',
    'any.required': 'Year is required'
  })
});

const getSchoolHealthSurveysByRegionDivision = Joi.object({
  region: Joi.string().required().messages({
    'string.empty': 'Region is required',
    'any.required': 'Region is required'
  }),
  division: Joi.string().required().messages({
    'string.empty': 'Division is required',
    'any.required': 'Division is required'
  }),
  year: Joi.string()
});


const getRegionalStatistics = Joi.object({
  region: Joi.string().required().messages({
    'string.empty': 'Region is required',
    'any.required': 'Region is required'
  }),
  year: Joi.string().required().messages({
    'string.empty': 'Year is required',
    'any.required': 'Year is required'
  })
});

const bulkUpdateStatus = Joi.object({
  surveyIds: Joi.array().items(schoolHealthSurveyIdSchema).required().messages({
    'array.base': 'Survey IDs must be an array',
    'any.required': 'Survey IDs are required'
  }),
  status: Joi.string().valid('draft', 'completed', 'submitted', 'approved').required().messages({
    'any.only': 'Status must be one of: draft, completed, submitted, approved',
    'any.required': 'Status is required'
  })
});

const duplicateSurvey = Joi.object({
  schoolHealthSurveyId: schoolHealthSurveyIdSchema,
  newYear: Joi.string().required().messages({
    'string.empty': 'New year is required',
    'any.required': 'New year is required'
  })
});

const exportSurveyData = Joi.object({
  region: Joi.string().trim(),
  division: Joi.string().trim(),
  year: Joi.string().trim(),
  surveyStatus: Joi.string().valid('draft', 'completed', 'submitted', 'approved')
});

const getEnrollmentStatistics = Joi.object({
  schoolId: Joi.string().trim(),
  schoolYear: Joi.string().trim()
});

const getPersonnelStatistics = Joi.object({
  schoolId: Joi.string().trim()
});

const getExaminedAssessedStatistics = Joi.object({
  schoolId: Joi.string().trim(),
  schoolYear: Joi.string().trim()
});

const getCommonSignsSymptoms = Joi.object({
  schoolId: Joi.string().trim(),
  schoolYear: Joi.string().trim()
});

const getHealthProfileStatistics = Joi.object({
  schoolId: Joi.string().trim(),
  schoolYear: Joi.string().trim()
});

const getConsolidatedStatistics = Joi.object({
  gradeFrom: Joi.string()
    .valid('Kinder', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
      'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12')
    .required()
    .messages({
      'any.only': 'Invalid grade level for gradeFrom',
      'any.required': 'gradeFrom is required'
    }),
  gradeTo: Joi.string()
    .valid('Kinder', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
      'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12')
    .required()
    .messages({
      'any.only': 'Invalid grade level for gradeTo',
      'any.required': 'gradeTo is required'
    }),
  month: Joi.number().integer().min(1).max(12).required().messages({
    'number.base': 'Month must be a number',
    'number.min': 'Month must be between 1 and 12',
    'number.max': 'Month must be between 1 and 12',
    'any.required': 'Month is required'
  }),
  year: Joi.number().integer().min(2000).max(2100).required().messages({
    'number.base': 'Year must be a number',
    'number.min': 'Year must be between 2000 and 2100',
    'number.max': 'Year must be between 2000 and 2100',
    'any.required': 'Year is required'
  })
});

export {
  createSchoolHealthSurvey,
  getSchoolHealthSurveys,
  getSchoolHealthSurvey,
  schoolHealthSurveyId,
  updateSchoolHealthSurvey,
  deleteSchoolHealthSurvey,
  getSchoolHealthSurveysByYear,
  getSchoolHealthSurveysByRegionDivision,
  markSurveyStatus,
  approveSurvey,
  rejectSurvey,
  getRegionalStatistics,
  bulkUpdateStatus,
  duplicateSurvey,
  exportSurveyData,
  getEnrollmentStatistics,
  getPersonnelStatistics,
  getExaminedAssessedStatistics,
  getCommonSignsSymptoms,
  getHealthProfileStatistics,
  getConsolidatedStatistics
};