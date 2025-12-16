import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export function isValidGradeLevel(gradeLevel) {
  const validGrades = [
    'kinder', 'kinderSPED', 'grade1', 'grade1SPED', 'grade2', 'grade2SPED',
    'grade3', 'grade3SPED', 'grade4', 'grade4SPED', 'grade5', 'grade5SPED',
    'grade6', 'grade6SPED', 'grade7', 'grade7SPED', 'grade8', 'grade8SPED',
    'grade9', 'grade9SPED', 'grade10', 'grade10SPED', 'grade11', 'grade11SPED',
    'grade12', 'grade12SPED'
  ];
  return validGrades.includes(gradeLevel);
}

export function getAllGradeFields() {
  return [
    'kinder', 'kinderSPED', 'grade1', 'grade1SPED', 'grade2', 'grade2SPED',
    'grade3', 'grade3SPED', 'grade4', 'grade4SPED', 'grade5', 'grade5SPED',
    'grade6', 'grade6SPED', 'grade7', 'grade7SPED', 'grade8', 'grade8SPED',
    'grade9', 'grade9SPED', 'grade10', 'grade10SPED', 'grade11', 'grade11SPED',
    'grade12', 'grade12SPED'
  ];
}
export function extractAuditInfo(user) {

  if (!user) return {};
  return {
    personnelName: `${user.firstName} ${user.lastName}`,
    personnelType: user.role,
    personnelId: user._id,
    schoolId: user.schoolId || null,
    schoolName: user.schoolName || null,
    schoolDistrictDivision: user.schoolDistrictDivision || null,
    associatedSchools: user.getAssociatedSchools ? user.getAssociatedSchools() : null
  };
}

export function getFileTypeFromMimeType(mimeType) {
  if (!mimeType) return 'other';

  const mimeTypeLower = mimeType.toLowerCase();

  if (mimeTypeLower.startsWith('image/')) {
    return 'image';
  }

  if (mimeTypeLower === 'application/pdf') {
    return 'pdf';
  }

  if (
    mimeTypeLower === 'application/msword' ||
    mimeTypeLower === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'word';
  }

  if (
    mimeTypeLower === 'application/vnd.ms-excel' ||
    mimeTypeLower === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return 'excel';
  }

  return 'other';
}

export const g = (obj, pathStr, d = '') => {
  if (!obj) return d;
  return pathStr.split('.').reduce((acc, p) => (acc && typeof acc === 'object' ? acc[p] : undefined), obj) ?? d;
};


export function getTemplatePath(templateFileName) {
  const possiblePaths = [
    path.join(process.cwd(), 'templates', templateFileName),
    path.join(process.cwd(), '..', 'templates', templateFileName),
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', templateFileName),
    path.join('/var/task', 'templates', templateFileName),
  ];

  for (const templatePath of possiblePaths) {
    if (fs.existsSync(templatePath)) {
      return templatePath;
    }
  }

  return possiblePaths[0];
}
