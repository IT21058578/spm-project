const ErrorMessage = {
  // Not Found
  PRODUCT_NOT_FOUND: 'Product not found',
  USER_NOT_FOUND: 'User not found',
  TOKEN_NOT_FOUND: 'Token not found',
  REVIEW_NOT_FOUND: 'Review not found',
  FILE_NOT_FOUND: 'File not found',

  // Already exists
  PRODUCT_ALREADY_EXISTS: 'Product already exists',
  USER_ALREADY_EXISTS: 'User already exists',

  // Authoriztion
  INVALID_CREDENTIALS: 'Invalid credentials',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  NOT_AUTHENTICATED: 'Not authenticated',
  INVALID_TOKEN: 'Invalid token',
  EMAIL_NOT_VERIFIEd: 'Email not verified',

  // Misc
  NOT_ENOUGH_STOCK: 'Not enough stock',
  INVALID_FILE_NAME: 'Invalid file name',
} as const;

export default ErrorMessage;
