import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../../componentes/admin-sidebar/admin-sidebar';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from "../../../componentes/loading/loading";

@Component({
  selector: 'app-jogos',
  imports: [ReactiveFormsModule, CommonModule, AdminSidebar, RouterLink, Loading],
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
  imagemPreview: string | null = null;
  jogos = signal<any[]>([]);
  jogosFiltrados = signal<any[]>([])
  categorias = signal<any[]>([]);
  isLoading = signal(false)
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
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      if (this.id) {
      this.isLoading.set(true)
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
          this.imagemPreview = res.data.image_url
          this.isLoading.set(false)
        },
        error: (err) => {
          alert("Erro ao editar o jogo")
          this.isLoading.set(false)
        }
      });
    }
    })
    this.filterForm.valueChanges.subscribe(() => {
      this.filtarJogos();
    });
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (!input.files?.length) {
      this.imagemselecionada = null;
      this.imagemPreview = null;
      return;
    }
  
    const file = input.files[0];
  
    if (!file.type.startsWith('image/')) {
      alert('Selecione apenas imagens.');
      return;
    }
  
    // Remove a URL anterior da memória
    if (this.imagemPreview) {
      URL.revokeObjectURL(this.imagemPreview);
    }
  
    this.imagemselecionada = file;
    this.imagemPreview = URL.createObjectURL(file);
    
  }
  onSubmit(): void {
    this.isLoading.set(true)
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
          this.isLoading.set(false)
          this.router.navigate(['/Admin/Jogos']);
        },
        error: (err) => {
          alert("Erro ao atualizar o jogo");
          this.isLoading.set(false)
        },
      });
    } else {
      this.jogoservice.cadastrar(formData).subscribe({
        next: () => {
          alert('Publicado com sucesso!');
          this.getJogos()
          this.isLoading.set(false)
          this.limparForm()
        },
      });
    }
  }
  getJogos() {
    this.isLoading.set(true)
    this.jogoservice.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data.sort((a: any, b: any) => a.id - b.id));
        this.jogosFiltrados.set(this.jogos())
        this.isLoading.set(false)
      },
      error: (erro) => {
        alert('Erro ao buscar os dados');
        this.isLoading.set(false)
      },
    });
  }
  deletarJogo(id: number) {
    this.isLoading.set(true)
    this.jogoservice.deletarjogo(id).subscribe({
      next: () => {
        this.isLoading.set(false)
        this.jogosFiltrados.set(this.jogosFiltrados().filter((game: any) => game.id !== id))
      },
      error: (erro) => {
        this.isLoading.set(false)
        alert('Não foi possível excluir o jogo');
      },
    });
  }
  getCategory() {
    this.isLoading.set(true)
    this.categoryservice.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data);
        this.isLoading.set(false)
      },
      error: (err) =>{
        this.isLoading.set(false)
        alert("Erro ao obter as categorias!")
      }
    });
  }
  limparForm(){
    this.jogosForm.reset({
      name: '',
      description: '',
      categoryId: '',
      ageRating: '',
      controls: '',
      gameUrl: '',
    })
    this.imagemPreview = null
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
