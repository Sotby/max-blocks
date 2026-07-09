import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../../componentes/admin-sidebar/admin-sidebar';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-jogos',
  imports: [ReactiveFormsModule, CommonModule, AdminSidebar, RouterLink],
  templateUrl: './jogos.html',
  styleUrl: './jogos.css',
})
export class Jogos implements OnInit {
  authservice = inject(AuthService);
  jogoservice = inject(DashboardJogosService);
  categoryservice = inject(DashboardCategoriasService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  imagemselecionada: File | null = null;
  jogos = signal<any[]>([]);
  jogosFiltrados = signal<any[]>([])
  categorias = signal<any[]>([]);
  id: any;
  jogosForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    ageRating: new FormControl('', [Validators.required]),
    controls: new FormControl('', [Validators.required]),
    gameUrl: new FormControl('', [Validators.required]),
  });
  filterForm = new FormGroup({
    gameId: new FormControl(''),
    gameName: new FormControl(''),
    categoryId: new FormControl('')
  })
  ngOnInit(): void {
    this.getJogos();
    this.getCategory();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.jogoservice.getID(this.id).subscribe({
        next: (res) => {
          this.jogosForm.patchValue({
            name: res.data.name,
            description: res.data.description,
            categoryId: res.data.categoryId,
            ageRating: res.data.ageRating,
            controls: res.data.controls,
            gameUrl: res.data.gameUrl,
          });
        },
      });
    }
    this.filterForm.valueChanges.subscribe(() => {
      this.filtarJogos();
    });
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imagemselecionada = input.files?.[0] ?? null;
  }
  onSubmit(): void {
    const formData = new FormData();
    const values = this.jogosForm.value;

    Object.entries(values).forEach(([Key, value]) => {
      formData.append(Key, String(value));
    });

    if (this.imagemselecionada) {
      formData.append('image', this.imagemselecionada);
    }
    if (this.id) {
      this.jogoservice.updateGame(formData, this.id).subscribe({
        next: (res) => {
          alert('Atualização realizada');
          this.router.navigate(['/Admin/Jogos']);
        },
        error: (err) => {
          alert(err.error.error);
        },
      });
    } else {
      this.jogoservice.cadastrar(formData).subscribe({
        next: () => {
          alert('Publicado com sucesso!');
        },
      });
    }
  }
  getJogos() {
    this.jogoservice.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data.sort((a: any, b: any) => a.id - b.id));
        this.jogosFiltrados.set(this.jogos())
        console.log('Dados Recebidos:', dados);
      },
      error: (erro) => {
        alert('Erro ao buscar os dados');
      },
    });
  }
  deletarJogo(id: number) {
    this.jogoservice.deletarjogo(id).subscribe({
      next: () => {
        console.log('Jogo deletado:', id);
        window.location.reload();
      },
      error: (erro) => {
        console.error('Erro ao deletar:', erro);
        alert('Não foi possível excluir o jogo');
      },
    });
  }
  getCategory() {
    this.categoryservice.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data);
        console.log('Dados das categorias recebidos:', dados);
      },
    });
  }
  filtarJogos(){
    const {gameId, gameName, categoryId} = this.filterForm.value
    let jogos = this.jogos()
    if(gameId){
      jogos = jogos.filter(jogo => jogo.id === gameId)
    }
    if(gameName?.trim()){
      jogos = jogos.filter(jogo => jogo.name.toLowerCase().includes(gameName.toLowerCase()))
    }
    if(categoryId){
      jogos = jogos.filter(jogo => jogo.categoryId ===Number(categoryId))
    }
    this.jogosFiltrados.set(jogos)
  }
}
