import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  // canonical property name
  apiUrl: 'https://localhost:7051/api',
  // keep backwards-compatible alias for any existing references
  apiBaseUrl: 'https://localhost:7051/api'
};