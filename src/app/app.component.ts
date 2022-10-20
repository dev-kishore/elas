import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Signup } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  signUpForm: FormGroup;
  loginForm: FormGroup;
  authenticationForm: FormGroup;
  subscription: Subscription;
  username: string;
  message: string = 'Please signup or login.'

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) {

    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      key: ['', Validators.required]
    })

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.authenticationForm = this.fb.group({
      username: this.username,
      key: ['', Validators.required],
      otp: ['', Validators.required]
    })

  }

  signUp() {
    this.subscription = this.authenticationService.signUp(this.signUpForm.value).subscribe(
      {
        next: (res) => {
          this.message = res.message
        },
        error: (err) => {
          console.log(err)
        }
      }
    )
    this.signUpForm.reset();
  }

  login() {
    this.subscription = this.authenticationService.login(this.loginForm.value).subscribe(
      {
        next: (res) => {
          if (res.message == 'Success!') {
            this.username = this.loginForm.get('username').value;
          }
          this.message = res.message
          this.loginForm.reset()
        },
        error: (err) => {
          console.log(err)
          this.loginForm.reset()
        }
      }
    )
  }

  authenticate() {
    let authenticationFormData = this.authenticationForm.value
    authenticationFormData.username = this.username
    this.subscription = this.authenticationService.authenticate(authenticationFormData).subscribe(
      {
        next: (res) => {
          this.message = res.message
        },
        error: (err) => {
          console.log(err)
        }
      }
    )
    this.authenticationForm.reset();
  }

  generateNewOTP() {
    const username = {
      username: this.username
    }
    this.subscription = this.authenticationService.generateNewOTP(username).subscribe(
      {
        next: (res) => {
          this.message = res.message
        },
        error: (err) => {
          console.log(err)
        }
      }
    )
    this.authenticationForm.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
