import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [
    CommonModule,
    FormsModule, 
    HttpClientModule
  ],
})
export class AuthComponent {
  credentials = {
    userName: '',
    password: ''
  };
  otp = '';
  otpStep = false;
  errorMessage = '';
  ws02Token='eyJ4NXQiOiJaakJrT1RNMlkyVmxaVGhqT1RjelpqUTNZalExWlRKbU56TTVOVE0wTVdFNU9XSTBNMk5pTTJGak1qRTFOREExWkRFNE1UWTJNVEk1Wmpsall6UmhNZyIsImtpZCI6IlpqQmtPVE0yWTJWbFpUaGpPVGN6WmpRM1lqUTFaVEptTnpNNU5UTTBNV0U1T1dJME0yTmlNMkZqTWpFMU5EQTFaREU0TVRZMk1USTVaamxqWXpSaE1nX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJlNWYwZTlkOS01MDdhLTQ5ZjAtOGIxNC1mZWQ5OThkODBkN2IiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6Ik4ycG5pOWJ4MFdQem5FMTNuX1hmMzNSUUtrb2EiLCJuYmYiOjE3MzM4MjEzNTEsImF6cCI6Ik4ycG5pOWJ4MFdQem5FMTNuX1hmMzNSUUtrb2EiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczovL2FwZ3cubWZzLmNvLmtlOjk0NDMvb2F1dGgyL3Rva2VuIiwiZXhwIjo2NDg0NzcyNTM1MSwiaWF0IjoxNzMzODIxMzUxLCJqdGkiOiJiNjY1OGQ0MC0zYWI4LTQzMTEtYjA3Mi0zODc1MTZjOWFmZGQiLCJjbGllbnRfaWQiOiJOMnBuaTlieDBXUHpuRTEzbl9YZjMzUlFLa29hIn0.xKFGzOmWs7bDw-prEYWzd2ksbHH31erz1ikedOnykJFTFQ3iAQoHU4NFdGntZlg9hE3Abjw5nliyqtI0O7wv7sUzmCVKh9azDdjWHky0J_W12t653hXIvQq5q4Q11jK9dBPKwYFZa0mCqq6yulcBVdrUgEHdcdOcl3IADqb07uUGTyjSsLNx4uNo5hwncAES8WdKtks8QCbMxG6OMRXfFaGfAbtVvUpC91i-e-1J-jt8Jvz0NrefysxqiUK2SH94KsysuroAUTDS0wcByN1pTQ6kc8CQeP9-TrfJWtEQv7LfrLMxhHkNH5Odd_e8NAZpsOtKIwacQwHkn-H4YQFxEQ';
  constructor(private http: HttpClient,private router: Router,private authService: AuthService) {}

  onSubmitCredentials() {
    this.errorMessage = '';
    this.http.post('https://pgw-bridge.mfs.co.ke/api-bridge/auth', this.credentials).subscribe({
      next: (response: any) => {
        if (response.successStatus==="success") {
          this.otpStep = true;
        } else {
          this.errorMessage = response.message || 'Invalid credentials';
        }
      },
      error: () => {
        this.errorMessage = 'Error connecting to the server. Please try again.';
      }
    });
  }
  private getHeaders(): HttpHeaders {
    const clientToken = sessionStorage.getItem('appToken');
    const clientKey = sessionStorage.getItem('appKey');
    const bearerToken = sessionStorage.getItem('ws02Token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Client-Token': clientToken ? clientToken : '', 
      'Client-Key': clientKey ? clientKey : '',  
      Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
    });
    // ws02Token
    return headers;
  }
  onSubmitOtp() {
    const authData = {
      ...this.credentials,
      otp: this.otp
    };
    this.http.post('https://pgw-bridge.mfs.co.ke/api-bridge/auth', authData).subscribe({
      next: (response: any) => {
        if (response.successStatus==="success") {
          this.authService.login();
          this.router.navigate(['/client/kyc']);
          console.log("response:",response)
          sessionStorage.setItem("ws02Token",this.ws02Token)
          sessionStorage.setItem("mymobitoken",response.body.authResponse.access_token)
          sessionStorage.setItem("clientKey",response.body.clientModel.clientKey)
          sessionStorage.setItem("clientId",response.body.clientModel.clientId)
      
          // save token on session
          //generate other tokens
          this.getKycToken();
        } else {
          this.errorMessage = response.message || 'Invalid OTP';
        }
      },
      error: () => {
        this.errorMessage = 'Invalid OTP';
      }
    });
  }
  getKycToken(): void {
    const headers = this.getHeaders();
    this.http.get("https://api-v2.mfs.co.ke/ocr/1.0/kyc-token",{headers}).subscribe({
      next: (response:any) => {
        // console.log(' kyc token response:', response);
        sessionStorage.setItem("appKey",response.appKey)
        sessionStorage.setItem("appToken",response.data.body.token)
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch token';
        console.error('Error:', error);
      }
    });
  }
  generateWs02Tokens(response: any) {
    const clientId = 'your-client-id';
    const clientSecret = 'your-client-secret';
    const tokenEndpoint = 'https://developer-v2.mfs.co.ke/oauth2/token'; 
    
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
  
    this.http.post(tokenEndpoint, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).subscribe({
      next: (tokenResponse: any) => {
        console.log('Other tokens generated successfully:', tokenResponse);
          if (tokenResponse.access_token) {
          sessionStorage.setItem('clientToken', tokenResponse.access_token);
        }
      },
      error: (error) => {
        console.error('Failed to generate other tokens:', error);
      }
    });
  }
  
}
