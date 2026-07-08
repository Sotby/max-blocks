import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBar } from "../../../componentes/nav-bar/nav-bar";
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { expand } from 'rxjs';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-jogos',
  imports: [NavBar, CommonModule],
  templateUrl: './lista-jogos.html',
  styleUrl: './lista-jogos.css',
})
export class ListaJogos implements OnInit{
  jogosService= inject(DashboardJogosService)
  categoryService = inject(DashboardCategoriasService)
  jogos = signal<any[]>([])
  jogosFiltrados = signal<any[]>([])
  categorias = signal<any[]>([])
  ngOnInit(): void {
    this.getJogos();
    this.getCategory()
  }
  getCategory(){
    this.categoryService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data)
      }
    })
  }
  getJogos(){
    this.jogosService.getALL().subscribe({
      next: (dados) =>{
        this.jogos.set(dados.data)
        this.jogosFiltrados.set(this.jogos())
      }
    })
  }
  filtrarJogosNome(nome: string){
    this.jogosFiltrados.set(this.jogos().filter(jogos => jogos.name === nome))
  }
}
