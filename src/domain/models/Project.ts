export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  isActive: boolean;
  client: { id: string; name: string };
  teamMembers: number;
}

export interface ProjectDetail extends ProjectSummary {
  users: ProjectUser[];
  developments: Development[];
  totalHours: number;
  totalImputs: number;
}

export interface ProjectUser {
  appUserId: string;
  name: string;
  surname: string;
  role: { id: string; name: string };
}

export interface Development {
  id: string;
  name: string;
  description: string;
  technology: { id: string; name: string };
  urlRepository: string;
  links: {
    id: string;
    environment: "STAGE" | "PREPRODUCTION" | "PRODUCTION";
    url: string;
  }[];
}
