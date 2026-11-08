/**
 * Backend API endpoints for Windie Cake application.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const ENDPOINT_PRODUCTS = '/products';
export const ENDPOINT_CATEGORIES = '/categories';
export const ENDPOINT_AUTH_LOGIN = '/auth/login';
export const ENDPOINT_AUTH_REGISTER = '/auth/register';
export const ENDPOINT_AUTH_ME = '/auth/me';
export const ENDPOINT_UPLOADS = '/uploads/image';
