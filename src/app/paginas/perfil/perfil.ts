import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NavBar } from "../../componentes/nav-bar/nav-bar";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [NavBar, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  authService = inject(AuthService)
  cadastrarCategoriaForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    image: new FormControl('',[Validators.required])
  })
  onSubmit(){
    
  }
}
