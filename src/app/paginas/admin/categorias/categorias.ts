import { Component, inject } from '@angular/core';
import { AdminNav } from "../../../componentes/admin-nav/admin-nav";
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';

@Component({
  selector: 'app-categorias',
  imports: [AdminNav, RouterLink, ReactiveFormsModule, RouterLinkActive],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias {
  authservice = inject(AuthService)
  imagemselecionada: File | null = null
  categoriasService  = inject(DashboardCategoriasService)
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
