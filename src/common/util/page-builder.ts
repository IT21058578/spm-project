import { SortOrder } from 'mongoose';

export type PageMetadata = {
  isFirst: boolean;
  isLast: boolean;
  totalDocuments: number;
  totalPages: number;
  pageSize: number;
  pageNum: number;
  sort?: {
    field: string;
    direction: SortOrder;
  };
};

export type Page<T> = {
  content: T[];
  metadata: PageMetadata;
};

export class PageBuilder {
  static buildPage<T>(
    content: T[],
    metadata: {
      totalDocuments: number;
      pageSize: number;
      pageNum: number;
      sort?: {
        field: string;
        direction: SortOrder;
      };
    },
  ): Page<T> {
    const totalPages = Math.ceil(metadata.totalDocuments / metadata.pageSize);
    const isFirst = metadata.pageNum <= 1;
    const isLast = metadata.pageNum === totalPages;

    return {
      content,
      metadata: {
        ...metadata,
        isFirst,
        isLast,
        totalPages,
      },
    };
  }
}
