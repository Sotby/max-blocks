import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBar } from "../../../componentes/nav-bar/nav-bar";
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { expand } from 'rxjs';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-jogos',
  imports: [NavBar, CommonModule, ReactiveFormsModule],
  templateUrl: './lista-jogos.html',
  styleUrl: './lista-jogos.css',
})
export class ListaJogos implements OnInit{
  jogosService= inject(DashboardJogosService)
  categoryService = inject(DashboardCategoriasService)
  jogos = signal<any[]>([])
  jogosFiltrados = signal<any[]>([])
  categorias = signal<any[]>([])
  filterForm = new FormGroup({
    name: new FormControl(''),
    categoryId: new FormControl('')
  })
  ngOnInit(): void {
    this.getJogos();
    this.getCategory()
    this.filterForm.valueChanges.subscribe(() => {
      this.filtrarJogos();
    });
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
  filtrarJogos(){
    const {name, categoryId} = this.filterForm.value
    let jogos = this.jogos();

    if (name?.trim()) {
      jogos = jogos.filter(jogo =>
        jogo.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  
    if (categoryId) {
      jogos = jogos.filter(jogo =>
        jogo.categoryId === Number(categoryId)
      );
    }
    this.jogosFiltrados.set(jogos);
  }
  private getLikedGames(){
    const likes = localStorage.getItem('likedGames')
    return likes ? JSON.parse(likes) : []
  }
  private saveLikedGames(likes: number[]) {
    localStorage.setItem('likedGames', JSON.stringify(likes));
  }
  isLiked(id: number): boolean{
    return this.getLikedGames().includes(id)
  }
  gameFeedback(id: number){
    const likedGames = this.getLikedGames();
    const jogo = this.jogos().find(j => j.id === id);
  
    if(!jogo) return;
  
    if(likedGames.includes(id)){
      this.jogosService.descurtirJogo(id).subscribe({
        next: () => {
          const novosLikes = likedGames.filter(
            (jogoId: number) => jogoId !== id
          );
  
          this.saveLikedGames(novosLikes);
  
          jogo.likesCount--;
  
          this.atualizarJogos();
        }
      });
  
    } else {
      this.jogosService.curtirJogo(id).subscribe({
        next: () => {
          likedGames.push(id);
  
          this.saveLikedGames(likedGames);
  
          jogo.likesCount++;
  
          this.atualizarJogos();
        }
      });
    }
  }
  private atualizarJogos(){
    this.jogos.set([...this.jogos()]);
    this.filtrarJogos();
  }
}
