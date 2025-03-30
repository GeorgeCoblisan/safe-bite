import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-account',
  imports: [IonButton, IonToolbar, IonHeader, IonContent, IonButtons, IonTitle],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent {
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {}

  navigateToRegisterPage() {
    this.navCtrl.navigateForward(['/account/register'], {
      relativeTo: this.activatedRoute,
    });
  }
}
