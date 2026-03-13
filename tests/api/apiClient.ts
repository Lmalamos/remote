// ============================================
// API CLIENT
// ============================================
import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { getCurrentEnvironment } from '../config/env';

/**
 * Base API Client for making HTTP requests
 */
export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    const env = getCurrentEnvironment();
    this.baseURL = env.apiUrl;
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.get(`${this.baseURL}${endpoint}`, options);
    return response;
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      ...options
    });
    return response;
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      ...options
    });
    return response;
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`, options);
    return response;
  }

  /**
   * Verify response status
   */
  async verifyStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status(), `Expected status ${expectedStatus} but got ${response.status()}`).toBe(expectedStatus);
  }

  /**
   * Verify response is OK (200-299)
   */
  async verifyOK(response: APIResponse): Promise<void> {
    expect(response.ok(), `Expected OK response but got ${response.status()}`).toBe(true);
  }

  /**
   * Get JSON response
   */
  async getJSON<T = any>(response: APIResponse): Promise<T> {
    return await response.json();
  }

  /**
   * Verify JSON response has specific structure
   */
  async verifyJSONStructure(response: APIResponse, expectedKeys: string[]): Promise<void> {
    const json = await response.json();

    for (const key of expectedKeys) {
      expect(json).toHaveProperty(key);
    }
  }
}

/**
 * Member API Client
 */
export class MemberApiClient extends ApiClient {
  /**
   * Search for members
   */
  async searchMembers(params: {
    clientId?: string;
    memberId?: string;
    lastName?: string;
    firstName?: string;
    [key: string]: any;
  }): Promise<APIResponse> {
    const queryString = new URLSearchParams(params as any).toString();
    return await this.get(`/data/patientOverview?${queryString}`);
  }

  /**
   * Get member details
   */
  async getMemberDetails(memberId: string): Promise<APIResponse> {
    return await this.get(`/member/${memberId}`);
  }

  /**
   * Create member (if endpoint exists)
   */
  async createMember(memberData: any): Promise<APIResponse> {
    return await this.post('/member', memberData);
  }

  /**
   * Update member
   */
  async updateMember(memberId: string, memberData: any): Promise<APIResponse> {
    return await this.put(`/member/${memberId}`, memberData);
  }

  /**
   * Delete member
   */
  async deleteMember(memberId: string): Promise<APIResponse> {
    return await this.delete(`/member/${memberId}`);
  }
}

/**
 * Provider API Client
 */
export class ProviderApiClient extends ApiClient {
  /**
   * Search for providers
   */
  async searchProviders(params: {
    npi?: string;
    city?: string;
    state?: string;
    [key: string]: any;
  }): Promise<APIResponse> {
    const queryString = new URLSearchParams(params as any).toString();
    return await this.get(`/provider/search?${queryString}`);
  }

  /**
   * Get provider details
   */
  async getProviderDetails(providerId: string): Promise<APIResponse> {
    return await this.get(`/provider/${providerId}`);
  }
}

/**
 * Authentication API Client
 */
export class AuthApiClient extends ApiClient {
  /**
   * Login via API
   */
  async login(username: string, password: string): Promise<APIResponse> {
    return await this.post('/auth/login', {
      username,
      password
    });
  }

  /**
   * Logout via API
   */
  async logout(): Promise<APIResponse> {
    return await this.post('/auth/logout');
  }

  /**
   * Verify authentication token
   */
  async verifyToken(token: string): Promise<APIResponse> {
    return await this.get('/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
