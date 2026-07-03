import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardCategoriasService {
  private readonly http=inject(HttpClient)
  private readonly apiURL='https://api-senai-angular.vercel.app/api/maxblock/categories'

  getALL():Observable<any>{
    return this.http.get(`${this.apiURL}`)
  }
  cadastrarCategoria(formdata: FormData): Observable<any>{
    return this.http.post(`${this.apiURL}`,formdata)
  }
  getID(id: any): Observable<any>{
    return this.http.get(`${this.apiURL}/${id}`)
  }
  atualizarCategoria(formdata: FormData, id: any):Observable<any>{
    return this.http.put(`${this.apiURL}/${id}`,formdata)
  }
  atualizarCategoriaParcial(formdata: FormData, id: any): Observable<any>{
    return this.http.patch(`${this.apiURL}/${id}`,formdata)
  }
  deletarCategoria(id: any){
    return this.http.delete(`${this.apiURL}/${id}`)
  }
}
