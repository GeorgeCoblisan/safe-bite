import { Component } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanSharp } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [IonContent, IonButton, IonIcon],
})
export class HomeComponent {
  constructor() {
    addIcons({ scanSharp });
  }
}
