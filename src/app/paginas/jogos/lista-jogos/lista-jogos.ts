import { Component, inject, OnInit, signal } from '@angular/core';
import { NavBar } from '../../../componentes/nav-bar/nav-bar';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-jogos',
  imports: [NavBar, CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './lista-jogos.html',
  styleUrl: './lista-jogos.css',
})
export class ListaJogos implements OnInit {
  jogosService = inject(DashboardJogosService);
  categoryService = inject(DashboardCategoriasService);
  jogos = signal<any[]>([]);
  jogosFiltrados = signal<any[]>([]);
  categorias = signal<any[]>([]);
  filterForm = new FormGroup({
    name: new FormControl(''),
    categoryId: new FormControl(''),
    ordenator: new FormControl('3')
  });
  ngOnInit(): void {
    this.getJogos();
    this.getCategory();
    this.filterForm.valueChanges.subscribe(() => {
      this.filtrarJogos();
      this.ordenarJogos()
    });
  }
  getCategory() {
    this.categoryService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data);
      },
    });
  }
  getJogos() {
    this.jogosService.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data);
        this.jogosFiltrados.set(this.jogos());
      },
    });
  }
  filtrarJogos() {
    const { name, categoryId} = this.filterForm.value;
    let jogos = this.jogos();

    if (name?.trim()) {
      jogos = jogos.filter((jogo) => jogo.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (categoryId) {
      jogos = jogos.filter((jogo) => jogo.categoryId === Number(categoryId));
    }
    this.jogosFiltrados.set(jogos);
  }
  ordenarJogos(){
    const ordenador = Number(this.filterForm.value.ordenator)
    let jogos = this.jogosFiltrados();
    switch(ordenador){
      case 1:{
        jogos.sort((a: any, b: any)=> b.likesCount - a.likesCount)
        break
      }
      case 2: {
        jogos.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      }
      case 3: {
        jogos.sort((a: any, b: any) => 
          a.name.localeCompare(b.name)
        );
        break;
      }
    }
    this.jogosFiltrados.set(jogos)
  }
  limparFiltros() {
    this.filterForm.reset({
      name: '',
      categoryId: '',
      ordenator: '3'
    });
  }

  // FEEDBACK LOGIC
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
        },
      });
    } else {
      this.jogosService.curtirJogo(id).subscribe({
        next: () => {
          likedGames.push(id);
          this.saveLikedGames(likedGames);
          jogo.likesCount++;
          this.atualizarJogos();
        },
        error: (err) => {
          if(err.status === 409){
            this.jogosService.descurtirJogo(id).subscribe({
              next: () =>{
                const novosLikes = likedGames.filter((jogoId: number) => jogoId !== id);
                this.saveLikedGames(novosLikes);
                jogo.likesCount--;
                this.atualizarJogos();
              },
              error: (err) =>{
                console.error("ERRO:", err)
              }
            })
          }
        }
      });
    }
  }
  private atualizarJogos() {
    this.jogos.set([...this.jogos()]);
    this.filtrarJogos();
  }
}
