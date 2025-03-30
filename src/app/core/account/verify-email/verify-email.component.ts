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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

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

  constructor(
    private fromBuilder: FormBuilder,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
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
    console.log('Verifying code:', code);
  }

  resend(): void {
    this.navCtrl.navigateForward('account/register', {
      relativeTo: this.activatedRoute,
    });
  }
}
