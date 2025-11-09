import { DailyRevenueSummary } from './revenue-data.interface';

export interface RevenueDataResponse {
  shopId: number;
  shopName: string;
  data: DailyRevenueSummary[];
}
