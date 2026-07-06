import { Component, inject } from '@angular/core';
import { AdminNav } from "../../../componentes/admin-nav/admin-nav";
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categorias',
  imports: [AdminNav, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias {
  authservice = inject(AuthService)
}
