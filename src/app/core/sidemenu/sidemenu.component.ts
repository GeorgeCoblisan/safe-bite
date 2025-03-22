import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeSharp, settingsSharp, starSharp } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css',
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs, IonLabel],
})
export class SidemenuComponent implements OnInit, OnDestroy {
  isTabBarHidden = signal(false);

  private router = inject(Router);

  private navigationChangeSubscription: Subscription = new Subscription();

  constructor() {
    addIcons({ homeSharp, starSharp, settingsSharp });
  }

  ngOnInit(): void {
    this.navigationChangeSubscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isTabBarHidden.set(this.shouldHideTabBar());
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.navigationChangeSubscription.unsubscribe();
  }

  private shouldHideTabBar(): boolean {
    const hiddenRoutes = ['/products/product'];
    return hiddenRoutes.some((route) => this.router.url.includes(route));
  }
}
