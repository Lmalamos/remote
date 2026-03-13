// ============================================
// 3. ENVIRONMENT CONFIGURATION
// ============================================

// FILE: config/env.ts
export interface Environment {
  baseUrl: string;
  apiUrl: string;
  username: string;
  password: string;
  timeout: number;
}

export const environments: Record<string, Environment> = {
  local: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
    username: 'localuser',
    password: 'localpass',
    timeout: 30000
  },
  stage: {
    baseUrl: 'https://stage-aws.myqualitrac.com',
    apiUrl: 'https://stage-aws.myqualitrac.com/api',
    username: process.env.STAGE_USERNAME || 'autosmoke',
    password: process.env.STAGE_PASSWORD || 'Playwright!1',
    timeout: 60000
  },
  prod: {
    baseUrl: 'https://myqualitrac.com',
    apiUrl: 'https://myqualitrac.com/api',
    username: process.env.PROD_USERNAME || 'test',
    password: process.env.PROD_PASSWORD || 'test',
    timeout: 60000
  }
};

// Get current environment from ENV variable or default to stage
export const getCurrentEnvironment = (): Environment => {
  const env = process.env.TEST_ENV || 'stage';
  return environments[env] || environments.stage;
};