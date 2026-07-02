import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http=inject(HttpClient)
  private readonly apiURL='https://api-senai-angular.vercel.app/api'
  
  // cadastro_categoria(name:string,image:string)
}
