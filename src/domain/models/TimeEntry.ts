export interface TimeEntry {
  id: string;
  projectUserId: string;
  date: string;
  hour: number;
  comment: string | null;
  project?: { id: string; name: string };
}

export interface UserTimeEntriesResponse {
  totalHours: number;
  data: TimeEntry[];
}
