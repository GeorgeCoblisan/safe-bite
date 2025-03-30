import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  getPasswordError(key: string): boolean {
    const control = this.form!.get('password');
    return !!control && !!control.errors?.[key];
  }

  registerUser(): void {
    throw new Error('Method not implemented.');
  }

  private createForm(): void {
    this.form = this.formBuilder.group(
      {
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
}
