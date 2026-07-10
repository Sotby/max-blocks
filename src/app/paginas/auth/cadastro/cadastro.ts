import { Component, inject } from '@angular/core';
import { BannerLateral } from '../../../componentes/banner-lateral/banner-lateral';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  imports: [BannerLateral, RouterLink, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private authService = inject(AuthService);
  private router = inject(Router);
  private passwordMathValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get(`password`)?.value;
    const c_password = group.get(`c_password`)?.value;
    return password === c_password ? null : { passwordsMismath: true };
  }
  cadastroForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      c_password: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMathValidator.bind(this) },
  );
  onSubmit(): void{
    const{name,email,password} = this.cadastroForm.getRawValue();
    this.authService.cadastro(name!,email!,password!).subscribe({
      next: () =>{
        this.router.navigate(['/Inicio'])
      },
      error: (err) =>{
        alert(err.error.error)
      }
    })
  }
}
