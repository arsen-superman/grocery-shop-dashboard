import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  // canonical property name
  apiUrl: 'http://localhost:5141/api',
  // keep backwards-compatible alias for any existing references
  apiBaseUrl: 'http://localhost:5141/api'
};