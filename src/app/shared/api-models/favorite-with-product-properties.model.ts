import { RiskLevel } from './risk-level.enum';

export interface FavoriteWithProductProperties {
  customName: string;
  riskLevels: RiskLevel[];
}
