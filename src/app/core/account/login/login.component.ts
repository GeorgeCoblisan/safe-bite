import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  loginUser(): void {}

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
}
