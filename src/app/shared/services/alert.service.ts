import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private currentAlert?: HTMLIonAlertElement;

  constructor(private alertController: AlertController) {}

  async show(options: AlertOptions): Promise<void> {
    if (this.currentAlert) {
      await this.currentAlert.dismiss().catch(() => {});
      this.currentAlert = undefined;
    }

    this.currentAlert = await this.alertController.create(options);
    await this.currentAlert.present();
  }
}
