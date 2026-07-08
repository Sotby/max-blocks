import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from "../../../componentes/admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-visao-geral',
  imports: [RouterLink, RouterLinkActive, CommonModule, AdminSidebar],
  templateUrl: './visao-geral.html',
  styleUrl: './visao-geral.css',
})
export class VisaoGeral implements OnInit {
  authservice = inject(AuthService);
  jogosService = inject(DashboardJogosService);
  jogos = signal<Jogo[]>([]);
  ngOnInit(): void {
    this.getJogos();
  }
  getJogos() {
    this.jogosService.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data.sort((a: any,b: any) => a.id - b.id));
        console.log('Dados Recebidos:', dados);
      },
      error: (erro) => {
        alert('Erro ao buscar os dados');
      },
    });
  }
  deletarJogo(id: number) {
    this.jogosService.deletarjogo(id).subscribe({
      next: () => {
        console.log('Jogo deletado:', id);
        window.location.reload()
      },
      error: (erro) => {
        console.error('Erro ao deletar:', erro);
        alert('Não foi possível excluir o jogo');
      },
    });
  }
}
export interface Jogo {
  id: number;
  name: string;
  category: {
    name: string;
  };
}
