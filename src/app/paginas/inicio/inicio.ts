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
        const sortedData = [...dados.data]
          .sort((a: any, b: any) => b.likesCount - a.likesCount)
  
        this.topjogos.set(sortedData.slice(0, 3))
        this.jogos.set(dados.data)
  
        console.log("Dados dos jogos obtidos:", dados)
  
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
  }
}
