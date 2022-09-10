import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserData } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  types: string[] = ['Tenant', 'Property owner'];
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        if (authStatus) {
          this.isLoading = false;
        }
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const user: UserData = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      userType: form.value.userType,
      password: form.value.password
    };
    this.authService.createUser(user);
    this.isLoading =false;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
