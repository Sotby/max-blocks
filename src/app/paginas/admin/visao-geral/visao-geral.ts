import { Component, inject } from '@angular/core';
import { AdminNav } from "../../../componentes/admin-nav/admin-nav";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-visao-geral',
  imports: [AdminNav, RouterLink, RouterLinkActive],
  templateUrl: './visao-geral.html',
  styleUrl: './visao-geral.css',
})
export class VisaoGeral {
  authservice = inject(AuthService)
}
