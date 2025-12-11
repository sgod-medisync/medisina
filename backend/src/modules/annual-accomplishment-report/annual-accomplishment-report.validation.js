import BaseJoi from "joi";
import JoiDate from "@joi/date";
import mongoose from "mongoose";

const Joi = BaseJoi.extend(JoiDate);

const aarIdParam = Joi.string()
  .pattern(/^AAR-\d{8}-[A-Z0-9]{6}$/)
  .required()
  .messages({
    "string.base": "Annual Report ID must be a string",
    "string.empty": "Annual Report ID cannot be empty",
    "string.pattern.base": "Annual Report ID must follow the format AAR-YYYYMMDD-XXXXXX",
    "any.required": "Annual Report ID is required",

  });
const schoolYearPattern = Joi.string()
  .trim()
  .pattern(/^\d{4}-\d{4}$/)
  .required()
  .messages({
    "string.base": "School year must be a string",
    "string.empty": "School year cannot be empty",
    "string.pattern.base": "School year must follow the format YYYY-YYYY",
    "any.required": "School year is required"
  });

// Reusable validation schemas
const personCountValidation = Joi.object({
  male: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Male count must be a number",
    "number.integer": "Male count must be an integer",
    "number.min": "Male count cannot be negative"
  }),
  female: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Female count must be a number",
    "number.integer": "Female count must be an integer",
    "number.min": "Female count cannot be negative"
  })
}).default({ male: 0, female: 0 });

const staffCountValidation = Joi.object({
  teaching: Joi.object({
    male: Joi.number().integer().min(0).default(0),
    female: Joi.number().integer().min(0).default(0)
  }).default({ male: 0, female: 0 }),
  nonTeaching: Joi.object({
    male: Joi.number().integer().min(0).default(0),
    female: Joi.number().integer().min(0).default(0)
  }).default({ male: 0, female: 0 })
});

const healthAssessmentValidation = Joi.object({
  assessed: Joi.object({
    learners: Joi.number().integer().min(0).default(0),
    teachers: Joi.number().integer().min(0).default(0),
    ntp: Joi.number().integer().min(0).default(0)
  }),
  withHealthProblems: Joi.object({
    learners: Joi.number().integer().min(0).default(0),
    teachers: Joi.number().integer().min(0).default(0),
    ntp: Joi.number().integer().min(0).default(0)
  }),
  visionScreening: Joi.object({
    learners: Joi.number().integer().min(0).default(0)
  })
});

const treatmentValidation = Joi.object({
  learners: Joi.number().integer().min(0).default(0),
  teachers: Joi.number().integer().min(0).default(0),
  ntp: Joi.number().integer().min(0).default(0)
});

const consultationValidation = Joi.object({
  learners: Joi.number().integer().min(0).default(0),
  teachers: Joi.number().integer().min(0).default(0),
  ntp: Joi.number().integer().min(0).default(0)
});

const referralValidation = Joi.object({
  physician: Joi.number().integer().min(0).default(0),
  dentist: Joi.number().integer().min(0).default(0),
  guidance: Joi.number().integer().min(0).default(0),
  otherFacilities: Joi.number().integer().min(0).default(0),
  rhuDistrictProvincialHospital: Joi.number().integer().min(0).default(0)
});

const orientationTrainingValidation = Joi.object({
  learners: Joi.number().integer().min(0).default(0),
  teachers: Joi.number().integer().min(0).default(0),
  parents: Joi.number().integer().min(0).default(0),
  others: Joi.object({
    count: Joi.number().integer().min(0).default(0),
    specify: Joi.string().trim().allow('')
  })
});

const conferenceMeetingValidation = Joi.object({
  teachersAdministrators: Joi.number().integer().min(0).default(0),
  healthOfficials: Joi.number().integer().min(0).default(0),
  learners: Joi.number().integer().min(0).default(0),
  parents: Joi.number().integer().min(0).default(0),
  lguBarangay: Joi.number().integer().min(0).default(0),
  ngoStakeholders: Joi.number().integer().min(0).default(0)
});

const resourcePersonValidation = Joi.object({
  healthActivitiesPrograms: Joi.number().integer().min(0).default(0),
  classDiscussion: Joi.number().integer().min(0).default(0),
  healthClubsOrganization: Joi.number().integer().min(0).default(0)
});

const skinScalpValidation = Joi.object({
  pediculosis: Joi.number().integer().min(0).default(0),
  rednessOfSkin: Joi.number().integer().min(0).default(0),
  whiteSpots: Joi.number().integer().min(0).default(0),
  flakySkin: Joi.number().integer().min(0).default(0),
  minorInjuries: Joi.number().integer().min(0).default(0),
  impetigoBoil: Joi.number().integer().min(0).default(0),
  skinLesions: Joi.number().integer().min(0).default(0),
  acnePimples: Joi.number().integer().min(0).default(0),
  itchiness: Joi.number().integer().min(0).default(0)
});

const eyeEarValidation = Joi.object({
  mattedEyelashes: Joi.number().integer().min(0).default(0),
  eyeRedness: Joi.number().integer().min(0).default(0),
  ocularMisalignment: Joi.number().integer().min(0).default(0),
  eyeDischarge: Joi.number().integer().min(0).default(0),
  paleConjunctiva: Joi.number().integer().min(0).default(0),
  hordeolum: Joi.number().integer().min(0).default(0),
  earDischarge: Joi.number().integer().min(0).default(0),
  mucusDischarge: Joi.number().integer().min(0).default(0),
  noseBleeding: Joi.number().integer().min(0).default(0)
});

const mouthNeckThroatValidation = Joi.object({
  presenceOfLesions: Joi.number().integer().min(0).default(0),
  inflamedPharynx: Joi.number().integer().min(0).default(0),
  enlargedTonsils: Joi.number().integer().min(0).default(0),
  enlargedLymphnodes: Joi.number().integer().min(0).default(0)
});

const heartLungsValidation = Joi.object({
  rates: Joi.number().integer().min(0).default(0),
  murmur: Joi.number().integer().min(0).default(0),
  irregularHeartRate: Joi.number().integer().min(0).default(0),
  wheezes: Joi.number().integer().min(0).default(0)
});

const deformitiesValidation = Joi.object({
  acquired: Joi.object({
    count: Joi.number().integer().min(0).default(0),
    specify: Joi.string().trim().allow('')
  }),
  congenital: Joi.object({
    count: Joi.number().integer().min(0).default(0),
    specify: Joi.string().trim().allow('')
  })
});

const nutritionalStatusValidation = Joi.object({
  normal: Joi.number().integer().min(0).default(0),
  wasted: Joi.number().integer().min(0).default(0),
  severelyWasted: Joi.number().integer().min(0).default(0),
  obese: Joi.number().integer().min(0).default(0),
  overweight: Joi.number().integer().min(0).default(0),
  stunted: Joi.number().integer().min(0).default(0),
  tall: Joi.number().integer().min(0).default(0)
});

const abdomenValidation = Joi.object({
  abdominalPain: Joi.number().integer().min(0).default(0),
  distended: Joi.number().integer().min(0).default(0),
  tenderness: Joi.number().integer().min(0).default(0),
  dysmenorrhea: Joi.number().integer().min(0).default(0)
});

const dentalServiceValidation = Joi.object({
  gingivitis: Joi.number().integer().min(0).default(0),
  periodontalDisease: Joi.number().integer().min(0).default(0),
  malocclusion: Joi.number().integer().min(0).default(0),
  supernumeraryTeeth: Joi.number().integer().min(0).default(0),
  retainedDecidousTeeth: Joi.number().integer().min(0).default(0),
  decubitalUlcer: Joi.number().integer().min(0).default(0),
  calculus: Joi.number().integer().min(0).default(0),
  cleftLipPalate: Joi.number().integer().min(0).default(0),
  fluorosis: Joi.number().integer().min(0).default(0),
  others: Joi.object({
    count: Joi.number().integer().min(0).default(0),
    specify: Joi.string().trim().allow('')
  }),
  totalDMFT: Joi.number().integer().min(0).default(0),
  totalDmft: Joi.number().integer().min(0).default(0)
});

const signaturesValidation = Joi.object({
  preparedBy: Joi.object({
    name: Joi.string().required().trim().messages({
      "string.base": "Prepared by name must be a string",
      "string.empty": "Prepared by name cannot be empty",
      "any.required": "Prepared by name is required"
    }),
    designation: Joi.string().required().trim().messages({
      "string.base": "Prepared by designation must be a string",
      "string.empty": "Prepared by designation cannot be empty",
      "any.required": "Prepared by designation is required"
    }),
    date: Joi.date().min(1900).max('now').default(Date.now),
    signatureString: Joi.string().allow('')
  }).required().messages({
    "any.required": "Prepared by information is required"
  }),
  notedBy: Joi.object({
    name: Joi.string().required().trim().messages({
      "string.base": "Prepared by name must be a string",
      "string.empty": "Prepared by name cannot be empty",
      "any.required": "Prepared by name is required"
    }),
    designation: Joi.string().required().trim().messages({
      "string.base": "Prepared by designation must be a string",
      "string.empty": "Prepared by designation cannot be empty",
      "any.required": "Prepared by designation is required"
    }),
    date: Joi.date().min(1900).max('now').default(Date.now),
    signatureString: Joi.string().allow('')
  }).required().messages({
    "any.required": "Prepared by information is required"
  }),
});

const createReport = Joi.object({
  region: Joi.string().trim().allow('').optional().messages({
    "string.base": "Region must be a string",

  }),
  division: Joi.string().required().trim().messages({
    "string.base": "Division must be a string",
    "string.empty": "Division cannot be empty",
    "any.required": "Division is required"
  }),
  schoolYear: schoolYearPattern,
  schoolName: Joi.string().required().trim().messages({
    "string.base": "School name must be a string",
    "string.empty": "School name cannot be empty",
    "any.required": "School name is required"
  }),
  schoolIdNo: Joi.string().required().trim().messages({
    "string.base": "School ID number must be a string",
    "string.empty": "School ID number cannot be empty",
    "any.required": "School ID number is required"
  }),
  totalElemSchoolsVisited: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Total elementary schools visited must be a number",
    "number.integer": "Total elementary schools visited must be an integer",
    "number.min": "Total elementary schools visited cannot be negative"
  }),
  totalSecSchoolsVisited: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Total secondary schools visited must be a number",
    "number.integer": "Total secondary schools visited must be an integer",
    "number.min": "Total secondary schools visited cannot be negative"
  }),

  // General Information
  generalInformation: Joi.object({
    schoolEnrollment: personCountValidation,
    schoolPersonnel: staffCountValidation
  }).default({
    schoolEnrollment: { male: 0, female: 0 },
    schoolPersonnel: {
      teaching: { male: 0, female: 0 },
      nonTeaching: { male: 0, female: 0 }
    }
  }),

  // Health Services
  healthServices: Joi.object({
    healthAppraisal: healthAssessmentValidation,
    treatmentDone: treatmentValidation,
    pupilsDewormed: Joi.object({
      firstRound: Joi.number().integer().min(0).default(0),
      secondRound: Joi.number().integer().min(0).default(0)
    }),
    pupilsGivenIronSupplement: Joi.number().integer().min(0).default(0),
    pupilsImmunized: Joi.object({
      count: Joi.number().integer().min(0).default(0),
      vaccineSpecified: Joi.string().trim().allow('')
    }),
    consultationAttended: consultationValidation,
    referral: referralValidation
  }),

  // Health Education
  healthEducation: Joi.object({
    classesGivenHealthLectures: Joi.number().integer().min(0).default(0),
    orientationTraining: orientationTrainingValidation,
    conferenceMeeting: conferenceMeetingValidation,
    involvementAsResourcePerson: resourcePersonValidation
  }),

  // School Community Activities
  schoolCommunityActivities: Joi.object({
    ptaHomeroomMeetings: Joi.number().integer().min(0).default(0),
    parentEducationSeminar: Joi.number().integer().min(0).default(0),
    homeVisitsConducted: Joi.number().integer().min(0).default(0),
    hospitalVisitsMade: Joi.number().integer().min(0).default(0)
  }),

  // Common Signs & Symptoms
  commonSignsSymptoms: Joi.object({
    skinAndScalp: skinScalpValidation,
    eyeAndEars: eyeEarValidation,
    mouthNeckThroat: mouthNeckThroatValidation,
    heartAndLungs: heartLungsValidation,
    deformities: deformitiesValidation,
    nutritionalStatus: nutritionalStatusValidation,
    abdomen: abdomenValidation,
    dentalService: dentalServiceValidation,
    otherSignsSymptoms: Joi.array().items(Joi.string().trim())
  }),

  // Remarks
  remarks: Joi.string().trim().allow(''),

  // Signatures
  signatures: signaturesValidation.optional()
});

const reportIdParam = aarIdParam.required().messages({
  "any.required": "Report ID is required"
});

const updateReport = Joi.object({
  // All fields are optional for updates
  region: Joi.string().allow('').trim().messages({
    "string.base": "Region must be a string"
  }),
  division: Joi.string().trim().messages({
    "string.base": "Division must be a string"
  }),
  schoolYear: Joi.string().trim().pattern(/^\d{4}-\d{4}$/).messages({
    "string.base": "School year must be a string",
    "string.pattern.base": "School year must follow the format YYYY-YYYY"
  }),
  schoolName: Joi.string().trim().messages({
    "string.base": "School name must be a string"
  }),
  schoolIdNo: Joi.string().trim().messages({
    "string.base": "School ID number must be a string"
  }),
  totalElemSchoolsVisited: Joi.number().integer().min(0).messages({
    "number.base": "Total elementary schools visited must be a number",
    "number.integer": "Total elementary schools visited must be an integer",
    "number.min": "Total elementary schools visited cannot be negative"
  }),
  totalSecSchoolsVisited: Joi.number().integer().min(0).messages({
    "number.base": "Total secondary schools visited must be a number",
    "number.integer": "Total secondary schools visited must be an integer",
    "number.min": "Total secondary schools visited cannot be negative"
  }),
  generalInformation: Joi.object({
    schoolEnrollment: personCountValidation,
    schoolPersonnel: staffCountValidation
  }),
  healthServices: Joi.object({
    healthAppraisal: healthAssessmentValidation,
    treatmentDone: treatmentValidation,
    pupilsDewormed: Joi.object({
      firstRound: Joi.number().integer().min(0),
      secondRound: Joi.number().integer().min(0)
    }),
    pupilsGivenIronSupplement: Joi.number().integer().min(0),
    pupilsImmunized: Joi.object({
      count: Joi.number().integer().min(0),
      vaccineSpecified: Joi.string().trim().allow('')
    }),
    consultationAttended: consultationValidation,
    referral: referralValidation
  }),
  healthEducation: Joi.object({
    classesGivenHealthLectures: Joi.number().integer().min(0),
    orientationTraining: orientationTrainingValidation,
    conferenceMeeting: conferenceMeetingValidation,
    involvementAsResourcePerson: resourcePersonValidation
  }),
  schoolCommunityActivities: Joi.object({
    ptaHomeroomMeetings: Joi.number().integer().min(0),
    parentEducationSeminar: Joi.number().integer().min(0),
    homeVisitsConducted: Joi.number().integer().min(0),
    hospitalVisitsMade: Joi.number().integer().min(0)
  }),
  commonSignsSymptoms: Joi.object({
    skinAndScalp: skinScalpValidation,
    eyeAndEars: eyeEarValidation,
    mouthNeckThroat: mouthNeckThroatValidation,
    heartAndLungs: heartLungsValidation,
    deformities: deformitiesValidation,
    nutritionalStatus: nutritionalStatusValidation,
    abdomen: abdomenValidation,
    dentalService: dentalServiceValidation,
    otherSignsSymptoms: Joi.array().items(Joi.string().trim())
  }),
  remarks: Joi.string().trim().allow(''),
  signatures: signaturesValidation
}).min(1).messages({
  "object.min": "At least one field must be provided for update"
});

const schoolIdNoParam = Joi.string().required().trim().messages({
  "string.base": "School ID number must be a string",
  "string.empty": "School ID number cannot be empty",
  "any.required": "School ID number is required"
});

const schoolYearParam = schoolYearPattern;

const regionParam = Joi.string().trim().optional().messages({
  "string.base": "Region must be a string",
});

const divisionParam = Joi.string().required().trim().messages({
  "string.base": "Division must be a string",
  "string.empty": "Division cannot be empty",
  "any.required": "Division is required"
});

const getReportBySchoolAndYear = Joi.object({
  schoolIdNo: schoolIdNoParam,
  schoolYear: schoolYearParam
});

const getReportsBySchoolYear = Joi.object({
  schoolYear: schoolYearParam
});

const getReportsByRegionDivision = Joi.object({
  region: regionParam,
  division: divisionParam
});

const autoGenerateReport = Joi.object({
  schoolIdNo: schoolIdNoParam,
  schoolName: Joi.string().required().trim().messages({
    "string.base": "School name must be a string",
    "string.empty": "School name cannot be empty",
    "any.required": "School name is required"
  }),
  schoolYear: schoolYearPattern,
  region: Joi.string().trim().allow('').optional().messages({
    "string.base": "Region must be a string",
  }),
  division: Joi.string().trim().allow('').optional().messages({
    "string.base": "Division must be a string",
  }),
  signatures: signaturesValidation.optional(),
  startDate: Joi.date().min(1900).max("now").optional().messages({
    "date.base": "Start date must be a valid date"
  }),
  endDate: Joi.date().min(1900).max("now").optional().when('startDate', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('startDate')).messages({
      "date.min": "End date must be after start date"
    })
  }).messages({
    "date.base": "End date must be a valid date"
  }),
  totalElemSchoolsVisited: Joi.number().integer().min(0).default(1).messages({
    "number.base": "Total elementary schools visited must be a number",
    "number.integer": "Total elementary schools visited must be an integer",
    "number.min": "Total elementary schools visited cannot be negative"
  }),
  totalSecSchoolsVisited: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Total secondary schools visited must be a number",
    "number.integer": "Total secondary schools visited must be an integer",
    "number.min": "Total secondary schools visited cannot be negative"
  })
});

export {
  createReport,
  updateReport,
  reportIdParam,
  schoolIdNoParam,
  schoolYearParam,
  getReportBySchoolAndYear,
  getReportsBySchoolYear,
  getReportsByRegionDivision,
  autoGenerateReport,
  signaturesValidation,
  personCountValidation,
  staffCountValidation,
  healthAssessmentValidation,
  treatmentValidation,
  consultationValidation,
  referralValidation,
  orientationTrainingValidation,
  conferenceMeetingValidation,
  resourcePersonValidation,
  skinScalpValidation,
  eyeEarValidation,
  mouthNeckThroatValidation,
  heartLungsValidation,
  deformitiesValidation,
  nutritionalStatusValidation,
  abdomenValidation,
  dentalServiceValidation
};