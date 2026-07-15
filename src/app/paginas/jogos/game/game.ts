import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { NavBar } from "../../../componentes/nav-bar/nav-bar";
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Loading } from "../../../componentes/loading/loading";

@Component({
  selector: 'app-game',
  imports: [NavBar, RouterLink, CommonModule, Loading],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {
  jogoService = inject(DashboardJogosService) 
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  id: any
  game_data = signal<any>(null)
  Games = signal<any[]>([])
  isLoading = signal(false)
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      this.getGames()
    })
  }
  getGames(){
    this.isLoading.set(true)
    this.jogoService.getALL().subscribe({
      next: (dados) =>{
        this.Games.set(dados.data)
        this.game_data.set(this.Games().find(game => game.id === this.id))
        this.isLoading.set(false)
      },
      error: (err) =>{
        console.error(err)
        this.isLoading.set(false)
      }
    })
  }
  filterGames(){
    const filteredGames = this.Games().filter((jogo: any) => jogo.categoryId === this.game_data().categoryId && jogo.id !== this.game_data().id)
    return filteredGames
  }
  // FEEDBACK LOGIC
  private getLikedGames(){
    const likes = localStorage.getItem('likedGames')
    return likes ? JSON.parse(likes) : []
  }
  private saveLikedGames(likes: number[]){
    localStorage.setItem('likedGames',JSON.stringify(likes))
  }
  isLiked(id: number){
    return this.getLikedGames().includes(id)
  }
  gameFeedback(id : number){
    this.isLoading.set(true)
    const likedGames = this.getLikedGames()
    const game = this.Games().find((game: any) => game.id ===id)
    if(!game) return
    if(likedGames.includes(id)){
      this.jogoService.descurtirJogo(id).subscribe({
        next: () =>{
          const novosLikes = likedGames.filter((jogoId:number) => jogoId !== id)
          this.saveLikedGames(novosLikes)
          game.likesCount--
          this.updateGames()
          this.isLoading.set(false)
        },
        error: () =>{
          this.isLoading.set(false)
        }
      })
    }else{
      this.jogoService.curtirJogo(id).subscribe({
        next: () => {
          likedGames.push(id)
          this.saveLikedGames(likedGames)
          game.likesCount++
          this.updateGames()
          this.isLoading.set(false)
        },
        error: (err) =>{
          if(err.status === 409){
            this.jogoService.descurtirJogo(id).subscribe({
              next:() => {
                const novosLikes = likedGames.filter((jogoId: number)=> jogoId !== id)
                this.saveLikedGames(novosLikes)
                game.likesCount--
                this.updateGames()
                this.isLoading.set(false)
              },
              error: (err) =>{
                alert("Erro ao descurtir o jogo")
                this.isLoading.set(false)
              }
            })
          }
          else{
            alert("Erro ao curtir o jogo")
            this.isLoading.set(false)
          }
        }
      })
    }

  }
  private updateGames(){
    this.Games.set([...this.Games()])
    this.game_data.set(this.Games().find(game => game.id === this.id))
  }
}
