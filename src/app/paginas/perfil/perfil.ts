import { Component, inject, OnInit, signal} from '@angular/core';
import { AdminSidebar } from "../../componentes/admin-sidebar/admin-sidebar";
import { DashboardJogosService } from '../../core/services/dashboard.jogos.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Loading } from "../../componentes/loading/loading";

@Component({
  selector: 'app-perfil',
  imports: [AdminSidebar, RouterLink, CommonModule, Loading],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit{
  jogosService = inject(DashboardJogosService)
  jogos = signal<any[]>([])
  jogosCurtidos = signal<any[]>([])
  isLoading = signal(false)
  ngOnInit(): void {
    this.getGames()
  }
  getGames(){
    this.isLoading.set(true)
    this.jogosService.getALL().subscribe({
      next: (dat) => {
        this.jogos.set(dat.data)
        this.jogosCurtidos.set(this.filterGames())
        this.isLoading.set(false)
      },
      error: (err) =>{
        console.error(err)
        this.isLoading.set(false)
      }
    })
  }
  filterGames():any{
    return this.jogos().filter((game: any) => this.isLiked(game.id))
  }
  //FeedBack Logic

  private getLikedGames() {
    const likes = localStorage.getItem('likedGames');
    return likes ? JSON.parse(likes) : [];
  }
  private saveLikedGames(likes: number[]) {
    localStorage.setItem('likedGames', JSON.stringify(likes));
  }
  isLiked(id: number): boolean {
    return this.getLikedGames().includes(id);
  }
  gameFeedback(id: number) {
    this.isLoading.set(true)
    const likedGames = this.getLikedGames();
    const jogo = this.jogos().find((j) => j.id === id);
    if (!jogo) return;
    if (likedGames.includes(id)) {
      this.jogosService.descurtirJogo(id).subscribe({
        next: () => {
          const novosLikes = likedGames.filter((jogoId: number) => jogoId !== id);
          this.saveLikedGames(novosLikes);
          jogo.likesCount--;
          this.atualizarJogos();
          this.isLoading.set(false)
        },
        error: (err) => {
          console.error(err)
          this.isLoading.set(false)
        }
      });
    } else {
      this.jogosService.curtirJogo(id).subscribe({
        next: () => {
          likedGames.push(id);
          this.saveLikedGames(likedGames);
          jogo.likesCount++;
          this.atualizarJogos();
          this.isLoading.set(false)
        },
        error: (err) => {
          if(err.status === 409){
            this.jogosService.descurtirJogo(id).subscribe({
              next: () =>{
                const novosLikes = likedGames.filter((jogoId: number) => jogoId !== id);
                this.saveLikedGames(novosLikes);
                jogo.likesCount--;
                this.atualizarJogos();
                this.isLoading.set(false)
              },
              error: (err) =>{
                console.error("ERRO:", err)
                this.isLoading.set(false)
              }
            })
          }
        }
      });
    }
  }
  private atualizarJogos() {
    this.jogosCurtidos.set(this.filterGames());
  }
}
