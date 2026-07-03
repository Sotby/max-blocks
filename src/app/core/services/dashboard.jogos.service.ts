import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardJogosService {
  private readonly http=inject(HttpClient)
  private readonly apiURL='https://api-senai-angular.vercel.app/api/maxblock/games'

  getALL(): Observable<any>{
    return this.http.get(`${this.apiURL}`)
  }
  cadastrar(formdata: FormData): Observable<any>{
    return this.http.post(`${this.apiURL}`, formdata)
  }
  getID(id: any): Observable<any>{
    return this.http.get(`${this.apiURL}/${id}`)
  }
  updateGame(formdata: FormData, id: any): Observable<any>{
    return this.http.put(`${this.apiURL}/${id}`,formdata)
  }
  updateGameParcial(formdata: FormData, id: any): Observable<any>{
    return this.http.patch(`${this.apiURL}/${id}`,formdata)
  }
  deletarjogo(id: any): Observable<any>{
    return this.http.delete(`${this.apiURL}/${id}`)
  }
}
