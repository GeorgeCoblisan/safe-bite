import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonRange,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

import { RiskLevel } from '../../../../shared/api-models/risk-level.enum';
import { ComputeProductScoreService } from '../services/compute-product-score.service';

@Component({
  selector: 'app-product-score',
  imports: [
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonToolbar,
    IonContent,
    IonCard,
    IonRange,
    IonInput,
    ReactiveFormsModule,
  ],
  templateUrl: './product-score.component.html',
  styleUrl: './product-score.component.css',
})
export class ProductScoreComponent implements OnInit, OnDestroy {
  riskLevels?: RiskLevel[];

  productScore?: number;

  form?: FormGroup;

  private formValueChangesSubscription = new Subscription();

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.riskLevels =
      this.router.getCurrentNavigation()?.extras.state?.['data'];

    this.productScore = ComputeProductScoreService.computeScore(
      this.riskLevels!
    );

    this.createForm();
  }

  ngOnDestroy(): void {
    this.formValueChangesSubscription.unsubscribe();
  }

  countAdditivesByRisk(riskLevel: string): number {
    return this.riskLevels!.filter((risk) => risk.toString() === riskLevel)
      .length;
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      calories: [null],
      fat: [null],
      sugar: [null],
    });

    this.formValueChangesSubscription.add(
      this.form.valueChanges.subscribe(() => this.recalculateScore())
    );
  }

  private recalculateScore(): void {
    const { calories, fat, sugar } = this.form?.value;

    this.productScore = ComputeProductScoreService.computeScore(
      this.riskLevels!,
      calories ?? 0,
      fat ?? 0,
      sugar ?? 0
    );
  }
}
