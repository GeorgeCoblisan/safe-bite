import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeSharp, settingsSharp, starSharp } from 'ionicons/icons';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css',
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs, IonLabel],
})
export class SidemenuComponent {
  constructor() {
    addIcons({ homeSharp, starSharp, settingsSharp });
  }
}
