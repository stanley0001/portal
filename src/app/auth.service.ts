import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  login() {
    sessionStorage.setItem("loggedIn","YES")
  }

  logout() {
    sessionStorage.clear();
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem("loggedIn")==='YES'; 
  }
}
