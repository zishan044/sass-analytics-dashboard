import axios from 'axios';

export type RegisterData = {
  username: string;
  email: string;
  password: string;
}

export type LoginData = {
  email: string;
  password: string;
}

export type Project = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  owner_id: number;
};

export type User = {
  id: number;
  username: string;
  email: string;
  subscription_status: 'incomplete' | 'active' | 'canceled'; // Matches your SQLModel default
  stripe_customer_id: string | null;
  projects?: Project[];
};

export type ProjectCreate = {
  name: string;
  description?: string;
};

export interface AnalyticsEntry {
  date: string;
  events: number;
  revenue: number;
}

export interface AnalyticsResponse {
  data: AnalyticsEntry[];
}

export interface EventCreate {
  event_type: string;
  value: number;
}

export interface EventBulkPayload {
  project_id: number;
  events: EventCreate[];
}

export type ReportStatusResponse = {
  task_id: string;
  status: "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";
  result: {
    status: string;
    file_path: string;
  } | null;
}

export type GenerateReportResponse = {
  task_id: string;
  message: string;
}


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

export const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createProject = async (data: ProjectCreate): Promise<Project> => {
  const response = await api.post<Project>("/projects/", data);
  return response.data;
};

export const fetchProjectAnalytics = async (projectId: number): Promise<AnalyticsResponse> => {
  const response = await api.get<AnalyticsResponse>(`/analytics/${projectId}`);
  return response.data;
};

export const ingestEvents = async (payload: EventBulkPayload) => {
  const response = await api.post('/events/', payload);
  return response.data;
};

export const reportApi = {
  generate: (projectId: number) => 
    api.post<GenerateReportResponse>(`/reports/generate/${projectId}`).then(res => res.data),
    
  getStatus: (taskId: string) => 
    api.get<ReportStatusResponse>(`/reports/status/${taskId}`).then(res => res.data),
};

export const billingService = {

  createCheckoutSession: async () => {
    const { data } = await api.post<{ url: string }>("/billing/checkout-session");
    return data.url;
  },

  isPro: (user: User | null) => user?.subscription_status === 'active',
};