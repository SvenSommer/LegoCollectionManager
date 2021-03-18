import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private AuthGuardService: AuthGuardService, private router: Router)
  {
  }
  canActivate() {
      if (!this.AuthGuardService.gettoken()) {  
        this.router.navigateByUrl("/login");  
    }  
    return this.AuthGuardService.gettoken();  
  }
  
}
