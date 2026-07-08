import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from "../../../componentes/admin-sidebar/admin-sidebar";
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';

@Component({
  selector: 'app-jogos',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule, AdminSidebar],
  templateUrl: './jogos.html',
  styleUrl: './jogos.css',
})
export class Jogos implements OnInit{
  authservice = inject(AuthService)
  jogoservice = inject(DashboardJogosService)
  categoryservice = inject(DashboardCategoriasService)
  imagemselecionada: File | null = null
  idEditando: number | null = null
  jogos = signal<any[]>([])
  categorias = signal<any[]>([])
  ngOnInit(): void {
    this.getJogos();
    this.getCategory()
  }
  jogosForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    description : new FormControl('',[Validators.required]),
    categoryId : new FormControl('',[Validators.required]),
    ageRating : new FormControl('',[Validators.required]),
    controls : new FormControl('',[Validators.required]),
    gameUrl : new FormControl('',[Validators.required]),
  })
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    this.imagemselecionada = input.files?.[0] ?? null
  }
  onSubmit(): void {
    const formData = new FormData()
    const values = this.jogosForm.value

    Object.entries(values).forEach(([Key, value]) =>{
      formData.append(Key, String(value))
    })

    if(this.imagemselecionada) {
      formData.append("image", this.imagemselecionada)
    }
    this.jogoservice.cadastrar(formData).subscribe({
        next: () => {
          alert("Publicado com sucesso!")
        }
    })
  }
  getJogos() {
    this.jogoservice.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data.sort((a:any,b:any) => a.id - b.id));
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
        window.location.reload()
      },
      error: (erro) => {
        console.error('Erro ao deletar:', erro);
        alert('Não foi possível excluir o jogo');
      },
    });
  }
  editarJogo(id: number){
    this.idEditando=id
    this.jogoservice.getID(id).subscribe({
      next: (dados) =>{
        const jogo =dados.data ?? dados
        this.jogosForm.patchValue({
          name: jogo.name,
          description: jogo.description,
          categoryId: jogo.category.id,
          ageRating: jogo.ageRating,
          controls: jogo.controls,
          gameUrl: jogo.gameURL
        })
        console.log("Editando o jogo: ",jogo)
      },
      error: (erro) => {
        console.error(erro)
        alert("Erro ao carregar o jogo")
      }
    })
  }
  getCategory(){
    this.categoryservice.getALL().subscribe({
      next: (dados) =>{
        this.categorias.set(dados.data)
        console.log("Dados das categorias recebidos:", dados)
      }
    })
  }
}

