export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface TimeEntry {
  id: string;
  projectUserId: string;
  date: string;
  hour: number;
  comment: string;
  project: {
    id: string;
    name: string;
  };
}

export interface TimeEntriesResponse {
  totalHours: number;
  data: TimeEntry[];
}

