import { Component } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { AuthService } from '../../../shared/auth/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  imports: [IonButton, IonContent],
})
export class SettingsComponent {
  constructor(private authService: AuthService) {}

  signOut(): void {
    this.authService.signOut().subscribe();
  }
}
