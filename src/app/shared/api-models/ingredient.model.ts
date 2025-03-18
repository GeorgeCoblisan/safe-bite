import { RiskLevel } from './risk-level.enum';

export interface Ingredient {
  name: string;
  code: string;
  type: string;
  riskLevel: RiskLevel;
  effects: string;
}
