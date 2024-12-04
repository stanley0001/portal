import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  ws02Token='eyJ4NXQiOiJaakJrT1RNMlkyVmxaVGhqT1RjelpqUTNZalExWlRKbU56TTVOVE0wTVdFNU9XSTBNMk5pTTJGak1qRTFOREExWkRFNE1UWTJNVEk1Wmpsall6UmhNZyIsImtpZCI6IlpqQmtPVE0yWTJWbFpUaGpPVGN6WmpRM1lqUTFaVEptTnpNNU5UTTBNV0U1T1dJME0yTmlNMkZqTWpFMU5EQTFaREU0TVRZMk1USTVaamxqWXpSaE1nX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJTaWx2ZXJzdG9uZSIsImF1dCI6IkFQUExJQ0FUSU9OIiwiYXVkIjoiOHlKRXdXZk5JNDVmeTlKNDB3eFI0THNvV3ZzYSIsIm5iZiI6MTczMzIxMTI1NCwiYXpwIjoiOHlKRXdXZk5JNDVmeTlKNDB3eFI0THNvV3ZzYSIsInNjb3BlIjoiZGVmYXVsdCIsImlzcyI6Imh0dHBzOi8vYXBndy5tZnMuY28ua2U6OTQ0My9vYXV0aDIvdG9rZW4iLCJleHAiOjE3MzMyMTQ4NTQsImlhdCI6MTczMzIxMTI1NCwianRpIjoiOGQ4N2NkYWYtMDE3OS00NDRmLWFlMjctZDIwYzQwMzM2NDRkIiwiY2xpZW50X2lkIjoiOHlKRXdXZk5JNDVmeTlKNDB3eFI0THNvV3ZzYSJ9.F1pIMCgf2aRufL5nCIhoht_6X-hBJAn1LpgU2x_nW8mOubDfARGFa9x8Uz1yWc_Bg2NcvATh4F0GLEcj7pTVADCqryjaPV5pVEPod8P2RtcfztgfcRaHBYt2WBcTDcMvUEuPjiVCrE-D41e7VNeZyCe8muM3f0K6c_iyxFPI34J1Ry12JpDvAIKvQePhsLiVp_ojOtQrtnrt96dB2Em-DzXs-xJz-GD_dnXUNQp2GN18jRtUL43OdrO3rds1q-0cUUqI_55XcFTgiRR2FSVPAyVu1xYk1TrPl2LOsXoOM76Xs9rMHz--8ML3m4zwYxiXsuFWACB26kIRI6usqNNrwA';
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
    this.http.get("http://localhost:5052/kyc-token").subscribe({
      next: (response:any) => {
        console.log(' kyc token response:', response);
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
