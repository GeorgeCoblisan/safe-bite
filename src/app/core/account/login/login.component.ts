import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { first } from 'rxjs';

import { AuthService } from '../../../shared/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    IonButton,
    IonContent,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonInput,
    IonInputPasswordToggle,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form?: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  loginUser(): void {
    if (this.form && this.form.valid) {
      this.authService
        .signIn(
          this.form.controls['email'].value,
          this.form.controls['password'].value
        )
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.navCtrl.navigateForward('sidemenu/home', {
              relativeTo: this.activatedRoute,
            });
          },
          error: (err) => {
            this.presentLoginErrorToast();
          },
        });
    }
  }

  forgotPassword(): void {
    this.navCtrl.navigateForward('account/reset-password', {
      relativeTo: this.activatedRoute,
    });
  }

  navigateToCreateAccount(): void {
    this.navCtrl.navigateForward('account/create-account', {
      relativeTo: this.activatedRoute,
    });
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  private async presentLoginErrorToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Invalid email or password!',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}
