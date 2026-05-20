export interface CreateProjectDTO {
  id: string;
  name: string;
  description: string;
  startDate: string;
  clientId: string;
}

export interface UpdateProjectDTO {
  name: string;
  description: string;
  startDate: string;
  isActive: boolean;
  clientId: string;
}

export interface CreateDevelopmentDTO {
  id: string;
  name: string;
  description: string;
  technologyId: string;
  urlRepository: string;
}

export interface UpdateDevelopmentDTO {
  id: string;
  name: string;
  description: string;
  technologyId: string;
  urlRepository: string;
  links: {
    environment: string;
    url: string;
  }[];
}

export interface UpdateTimeEntryDTO {
  date: string;
  hour: number;
  comment: string;
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  clientId?: string;
  appUserId?: string;
  isActive?: boolean;
  search?: string;
}

export interface ProjectTimeEntryQueryParams {
  from?: string;
  to?: string;
  app_user_id?: string;
  min_hour?: number;
  max_hour?: number;
  has_comment?: boolean;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}
