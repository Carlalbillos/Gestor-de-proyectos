export interface HttpClient {
  post<T>(url: string, data: unknown): Promise<T>;
  get<T>(url: string): Promise<T>;
  put<T>(url: string, data: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}
