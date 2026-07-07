import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  imports: [RouterLink, ReactiveFormsModule, RouterLinkActive, CommonModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit{
  authservice = inject(AuthService)
  imagemselecionada: File | null = null
  categoriasService  = inject(DashboardCategoriasService)
  categorias = signal<Cat[]>([])
  ngOnInit(): void {
    this.getCategorias()
  }
  getCategorias(){
    this.categoriasService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data)
        console.log('Dados Recebidos:',dados)
      },
      error: (erro) => {
        alert('Erro ao buscar os dados')
      }
    })
  }
  deletarCategoria(id: number){
    this.categoriasService.deletarCategoria(id).subscribe({
      next: () => {
        window.location.reload()
      },
      error: (erro) => {
        alert('Não foi possivel excluir a categoria')
        console.error('Erro ao deletar:', erro)
      }
    })
  }
  categoriaform = new FormGroup({
    name: new FormControl('',[Validators.required])
  })
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    this.imagemselecionada = input.files?.[0] ?? null
  }
  onSubmit(): void {
    const formData = new FormData()
    const values = this.categoriaform.value

    Object.entries(values).forEach(([Key, value]) =>{
      formData.append(Key, String(value))
    })

    if(this.imagemselecionada) {
      formData.append("image", this.imagemselecionada)
    }

    this.categoriasService.cadastrarCategoria(formData).subscribe({
      next: () => {
        alert("Publicado com sucesso!")
      }
    })
  }
}
export interface Cat{
  id: number
  name: string
}
