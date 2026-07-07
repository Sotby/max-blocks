import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jogos',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './jogos.html',
  styleUrl: './jogos.css',
})
export class Jogos implements OnInit{
  authservice = inject(AuthService)
  jogoservice = inject(DashboardJogosService)
  imagemselecionada: File | null = null
  idEditando: number | null = null
  jogos = signal<Jogo[]>([])
  ngOnInit(): void {
    this.getJogos();
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
    if(this.idEditando !== null){
      this.jogoservice.cadastrar(formData).subscribe({
        next: () => {
          alert("Publicado com sucesso!")
        }
      })
    }
    else{
      this.jogoservice.updateGame(formData, this.idEditando).subscribe({
        next: () => {
          alert("Jogo alterado com sucesso!")
        }
      })
    }
  }
  getJogos() {
    this.jogoservice.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data);
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
}
export interface Jogo {
  id: number;
  name: string;
  ageRating: string;
  controls:string;
  gameURl: URL;
  category: {
    id: number
    name: string;
  };
}
