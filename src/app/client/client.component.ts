import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  title = 'KYC portal';

  constructor(private authService:AuthService,private router:Router){}
  isAuthenticated(){
    return this.authService.isAuthenticated;
  }
  handleAuthAction(){
     this.authService.logout()
     this.router.navigate(['/auth']);
  }
}
