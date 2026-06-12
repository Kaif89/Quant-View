/**
 * Centralized API configuration.
 * All hooks and services import the base URL from here
 * instead of hardcoding port numbers.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://quant-view-production.up.railway.app';
