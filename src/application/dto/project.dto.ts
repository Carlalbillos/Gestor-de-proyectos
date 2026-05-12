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
