import { DailyRevenueSummary } from './revenue-data.interface';

export interface RevenueDataResponse {
  tenantId: number;
  shopName: string;
  data: DailyRevenueSummary[];
}
