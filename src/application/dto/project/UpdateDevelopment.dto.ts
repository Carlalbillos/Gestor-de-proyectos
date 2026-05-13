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
