import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NavBar } from "../../componentes/nav-bar/nav-bar";

@Component({
  selector: 'app-perfil',
  imports: [NavBar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  authService = inject(AuthService)
}
