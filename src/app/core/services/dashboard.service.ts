import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http=inject(HttpClient)
  private readonly apiURLJogos='https://api-senai-angular.vercel.app/api/maxblock/'
  
  getAll(): Observable<any> {
    return this.http.get(`${this.apiURL}`)
  }

  cadastroCategoria(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiURL}`, formData)
  }
}
