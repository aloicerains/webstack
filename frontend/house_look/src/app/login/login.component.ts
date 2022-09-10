import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthData } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatussub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatussub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        if (authStatus) {
          this.isLoading = false;
        }
      }
    )
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const user: AuthData = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.login(user);
  }

  ngOnDestroy(): void {
    this.authStatussub.unsubscribe();
  }

}
