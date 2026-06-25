import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http=inject(HttpClient)
  private readonly apiURL='https://api-senai-angular.vercel.app/api'

  cadastro(name:string,email:string,password:string): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/register`,{name,email,password})
  }
  login(email:string,password:string): Observable<any>{
    return this.http.post(`${this.apiURL}/auth/login`, {email,password})
  }
}
