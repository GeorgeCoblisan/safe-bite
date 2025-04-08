import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selector: 'app-register',
  imports: [
    IonButton,
    IonInput,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonBackButton,
    IonHeader,
    ReactiveFormsModule,
    IonInputPasswordToggle,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  form?: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  getPasswordError(key: string): boolean {
    const control = this.form!.get('password');
    return !!control && !!control.errors?.[key];
  }

  registerUser(): void {
    if (this.form && this.form.valid) {
      this.authService
        .signUp({
          email: this.form.controls['email'].value,
          password: this.form.controls['password'].value,
          name: this.form.controls['name'].value,
        })
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.navCtrl.navigateForward('account/verify-email', {
              state: { data: this.form!.controls['email'].value },
              relativeTo: this.activatedRoute,
            });
          },
          error: (err) => {
            this.handleSignUpError(err);
          },
        });
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [null, Validators.required],
        email: [null, [Validators.required]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            this.hasUppercase,
            this.hasNumber,
            this.hasSpecialCharacter,
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  private hasUppercase(control: AbstractControl) {
    const value = control.value;

    if (value && !/[A-Z]/.test(value)) {
      return { uppercase: true };
    }

    return null;
  }

  private hasNumber(control: AbstractControl) {
    const value = control.value;

    if (value && !/\d/.test(value)) {
      return { number: true };
    }

    return null;
  }

  private hasSpecialCharacter(control: AbstractControl) {
    const value = control.value;

    if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { special: true };
    }

    return null;
  }

  private async handleSignUpError(error: any): Promise<void> {
    if (error.name === 'UsernameExistsException') {
      this.presentUserAlreadyExists();
      return;
    }

    this.presentSignUpError();
  }

  private async presentUserAlreadyExists(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'An user with this email already exists!',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }

  private async presentSignUpError(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Something went wrong, please try again!',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}
