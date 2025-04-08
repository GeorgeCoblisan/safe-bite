import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { first } from 'rxjs';

import { AuthService } from '../../../shared/auth/services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [
    IonContent,
    IonButton,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    ReactiveFormsModule,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  form?: FormGroup;

  userEmail?: string;

  constructor(
    private fromBuilder: FormBuilder,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.form = this.fromBuilder.group({
      d1: ['', [Validators.required]],
      d2: ['', [Validators.required]],
      d3: ['', [Validators.required]],
      d4: ['', [Validators.required]],
      d5: ['', [Validators.required]],
      d6: ['', [Validators.required]],
    });

    this.userEmail = this.router.getCurrentNavigation()?.extras.state?.['data'];
  }

  moveToNext(event: any, nextControlName: string): void {
    const input = event.target;

    if (input.value.length === 1) {
      const nextInput = document.querySelector(
        `[formcontrolname=${nextControlName}]`
      ) as HTMLElement;
      nextInput?.focus();
    }
  }

  onVerify(): void {
    const code = Object.values(this.form!.value).join('');

    if (this.form && this.form.valid && this.userEmail) {
      this.authService
        .confirmSignUp(this.userEmail, code)
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.navCtrl.navigateForward('account/login', {
              relativeTo: this.activatedRoute,
            });
          },
          error: (err) => {
            this.presentCodeVerificationError();
          },
        });
    }
  }

  resend(): void {
    this.navCtrl.navigateForward('account/register', {
      relativeTo: this.activatedRoute,
    });
  }

  private async presentCodeVerificationError(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'The 6 digit code is not correct! Try again!',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}
