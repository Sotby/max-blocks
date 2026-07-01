import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http=inject(HttpClient)
  private readonly apiURL='https://api-senai-angular.vercel.app/api'
  private router = inject(Router)
  cadastro(name:string,email:string,password:string): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/register`,{name,email,password})
  }
  login(email:string,password:string): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/login`, {email,password}).pipe(
      tap( (response: any) => {
        localStorage.setItem('token', response.token)
      })
    )
  }
  logout(): void{
    localStorage.removeItem('token')
    this.router.navigate(['/Inicio'])
  }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('token')
  }
  getToken(): string | null{
    return localStorage.getItem('token')
  }
}
