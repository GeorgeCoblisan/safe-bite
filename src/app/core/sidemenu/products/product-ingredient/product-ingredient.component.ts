import { Component, OnInit } from '@angular/core';
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
    IonIcon,
    IonTitle,
    IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pricetagOutline } from 'ionicons/icons';

import { Ingredient } from '../../../../shared/api-models/ingredient.model';
import { RiskLevel } from '../../../../shared/api-models/risk-level.enum';

@Component({
  selector: 'app-product-ingredient',
  imports: [
    IonContent,
    IonHeader,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
  ],
  templateUrl: './product-ingredient.component.html',
  styleUrl: './product-ingredient.component.css',
})
export class ProductIngredientComponent implements OnInit {
  ingredient?: Ingredient;

  additiveColorMapping: Record<RiskLevel, string> = {
    [RiskLevel.HIGH]: 'bg-red-600',
    [RiskLevel.MEDIUM]: 'bg-yellow-600',
    [RiskLevel.LOW]: 'bg-green-600',
  };

  constructor(private router: Router) {
    addIcons({ pricetagOutline });
  }

  ngOnInit(): void {
    this.ingredient =
      this.router.getCurrentNavigation()?.extras.state?.['data'];
  }
}
