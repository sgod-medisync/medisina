const isValidMongoObjectId = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.message('"{{#label}}" must be a string representing a MongoDB ObjectId');
  }
  const mongoObjectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!mongoObjectIdPattern.test(value)) {
    return helpers.message('"{{#label}}" must be a valid MongoDB ObjectId (24 hex characters)');
  }
  return value;
};

const password = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.message('password must be a string');
  }
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(value)) {
    return helpers.message('password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(value)) {
    return helpers.message('password must contain at least one lowercase letter');
  }
  if (!/\d/.test(value)) {
    return helpers.message('password must contain at least one number');
  }
  if (!/[@$#!%*?+=()\u0026_-]/.test(value)) {
    return helpers.message('password must include at least one special character');
  }
  return value;
};
const checkAge = (value, helpers) => {
  if (value.minAge > value.maxAge) {
    return helpers.message('minAge must be less than maxAge');
  }
  return value;
}


export {
  isValidMongoObjectId as objectId,
  password,
  checkAge,

}
