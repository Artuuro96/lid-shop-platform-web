export interface Base<T> {
  data: T;
  message: string;
  status: number;
  totalPages: number;
  page: number;
  items: number;
}