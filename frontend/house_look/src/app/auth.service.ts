import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


import { environment } from "src/environments/environment";
import { AuthData, UserData, resUserData } from "./models/user.model";

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getUser(userId: string) {
    return this.http.get
      <{message: string, user: resUserData, status: boolean}>
      (BACKEND_URL + userId);
  }

  getIsAuth () {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(user: UserData) {
    //const userData: UserData = { em, password };
    this.http.post(BACKEND_URL + 'signup', user)
      .subscribe({
        next: () => this.router.navigate(["/"]),
        error: () => this.authStatusListener.next(false)
      });

  }

  login(user: AuthData) {
    //const authData: AuthData = { email, password };
    this.http.post
    <{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', user)
      .subscribe({ next: (response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000); // millisecs
          //console.log(expirationDate.toISOString());
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error: () => {
        this.authStatusListener.next(false);
      }});
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    let expiresIn: number;
    if (authInformation) {
      const now = new Date();
      expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    }
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
