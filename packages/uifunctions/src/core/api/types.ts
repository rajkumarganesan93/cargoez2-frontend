export interface ApiResponse<T> {
  success: boolean;
  messageCode: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  messageCode: string;
  message: string;
  timestamp: string;
}
