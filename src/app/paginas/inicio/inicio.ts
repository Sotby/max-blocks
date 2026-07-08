import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBar } from '../../componentes/nav-bar/nav-bar';
import { DashboardJogosService } from '../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';
import { DashboardCategoriasService } from '../../core/services/dashboard.categorias.service';
@Component({
  selector: 'app-inicio',
  imports: [NavBar, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  jogosService = inject(DashboardJogosService)
  categoriasService = inject(DashboardCategoriasService)
  jogos = signal<any[]>([])
  topjogos = signal<any[]>([])
  categorias = signal<any[]>([])
  isLoading = signal(false)
  ngOnInit(): void {
    this.getGames()
    this.getCategory()
  }
  getGames(){
    this.isLoading.set(true)
    this.jogosService.getALL().subscribe({
      next: (dados) => {
        let sortedData = dados.data.sort((a: any, b: any) => b.likesCount - a.likesCount)
        sortedData.length = 3
        this.topjogos.set(sortedData)
        this.jogos.set(dados.data)
        console.log("Dados dos jogos obtidos:",dados)
        this.isLoading.set(false)
      }
    })
  }
  getCategory(){
    this.categoriasService.getALL().subscribe({
      next: (dados) =>{
        this.categorias.set(dados.data)
        console.log("Dados das categorias obtidos:",dados)
      }
    })
  }
  getGamesPerCategory(id: number){
    return this.jogos().filter(jogos => jogos.categoryId === id)
  }

}
