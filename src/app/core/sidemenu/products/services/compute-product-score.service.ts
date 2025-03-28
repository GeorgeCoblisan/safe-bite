import { Injectable } from '@angular/core';

import { RiskLevel } from '../../../../shared/api-models/risk-level.enum';

@Injectable({
  providedIn: 'root',
})
export class ComputeProductScoreService {
  constructor() {}

  static computeScore(
    riskLevels: RiskLevel[],
    calories?: number,
    fat?: number,
    sugar?: number
  ): number {
    const additiveSafety = this.computeAdditiveSafety(riskLevels);
    const calSafety = this.computeCalorieSafety(calories);
    const fatSafety = this.computeFatSafety(fat);
    const sugarSafety = this.computeSugarSafety(sugar);

    const nutritionSafety = (calSafety + fatSafety + sugarSafety) / 3;
    const weightAdditive = 0.8;
    const weightNutrition = 0.2;
    const overallSafety =
      weightAdditive * additiveSafety + weightNutrition * nutritionSafety;

    const finalScore = overallSafety * 9 + 1;
    return Math.min(Math.max(finalScore, 1), 10);
  }

  private static computeAdditiveSafety(riskLevels: RiskLevel[]): number {
    if (riskLevels.length === 0) return 1;

    let totalSafety = 0;
    riskLevels?.forEach((risk) => {
      if (risk === RiskLevel.LOW) {
        totalSafety += 1;
      } else if (risk === RiskLevel.MEDIUM) {
        totalSafety += 0.5;
      } else if (risk === RiskLevel.HIGH) {
        totalSafety += 0;
      }
    });

    return totalSafety / riskLevels.length;
  }

  private static computeCalorieSafety(calories: number | undefined): number {
    if (calories === undefined) return 1;

    const safety = (500 - calories) / 200;

    return Math.max(0, Math.min(safety, 1));
  }

  private static computeFatSafety(fat: number | undefined): number {
    if (fat === undefined) return 1;

    const safety = (5 - fat) / (5 - 1.5);

    return Math.max(0, Math.min(safety, 1));
  }

  private static computeSugarSafety(sugar: number | undefined): number {
    if (sugar === undefined) return 1;

    const safety = (22 - sugar) / (22 - 5);

    return Math.max(0, Math.min(safety, 1));
  }
}
