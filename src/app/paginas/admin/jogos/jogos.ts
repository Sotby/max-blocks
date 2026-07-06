import { Component, inject } from '@angular/core';
import { AdminNav } from "../../../componentes/admin-nav/admin-nav";
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';

@Component({
  selector: 'app-jogos',
  imports: [AdminNav, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './jogos.html',
  styleUrl: './jogos.css',
})
export class Jogos {
  authservice = inject(AuthService)
  jogoservice = inject(DashboardJogosService)
  imagemselecionada: File | null = null
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
}
