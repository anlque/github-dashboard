export type PaginationMeta = {
  page: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number | null;
};

export type PagedResult<T> = {
  data: T;
  pagination: PaginationMeta;
};
