import { SortOrder } from "mongoose";

export class PageRequest {
    pageNum: number;
    pageSize: number;
    sort?: {
        field: string;
        direction: SortOrder;
    }
}