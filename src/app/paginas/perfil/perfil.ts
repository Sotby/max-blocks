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
  CategoriaForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    image: new FormControl('',[Validators.required])
  })
  JogoForm=new FormGroup({
    name : new FormControl('',[Validators.required]),
    description : new FormControl('',[Validators.required]),
    categoryId: new FormControl('',[Validators.required]),
    ageRating : new FormControl('',[Validators.required]),
    controls : new FormControl('',[Validators.required]),
    gameUrl : new FormControl('',[Validators.required]),
    image: new FormControl('',[Validators.required]),
  })
  onSubmit(){
    
  }
}
