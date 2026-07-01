import { Component, inject } from '@angular/core';
import { BannerLateral } from "../../../componentes/banner-lateral/banner-lateral";
import { Router, RouterLink } from "@angular/router";
import { ɵInternalFormsSharedModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [BannerLateral, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService)
  private router = inject(Router)
  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
  })
  onSubmit(): void{
    const{email,password} = this.loginForm.getRawValue();
    this.authService.login(email!,password!).subscribe({
      next: () =>{
        alert("Login realizado com sucesso")
        this.router.navigate(['/Inicio'])
      },
      error: (err) =>{
        alert(err.error.error)
      }
    })
  }
}
