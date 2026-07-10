import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from "../../../componentes/admin-sidebar/admin-sidebar";
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';

@Component({
  selector: 'app-visao-geral',
  imports: [CommonModule, AdminSidebar, RouterLink],
  templateUrl: './visao-geral.html',
  styleUrl: './visao-geral.css',
})
export class VisaoGeral implements OnInit {
  authservice = inject(AuthService);
  jogosService = inject(DashboardJogosService);
  categoriasService = inject(DashboardCategoriasService)
  jogos = signal<any[]>([]);
  categorias = signal<any[]>([])
  ngOnInit(): void {
    this.getJogos();
    this.getCategorias();
  }
  getJogos() {
    this.jogosService.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data.sort((a: any,b: any) => a.updatedAt - b.updatedAt));
        this.filtrarJogosMes()
      },
      error: (erro) => {
        alert('Erro ao buscar os dados');
      },
    });
  }
  getCategorias(){
    this.categoriasService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data)
        this.filtrarCategoriasMes()
      }
    })
  }
  dataCompare(datacriacao: string){
    const dataHoje = new Date()
    const dataCriacaoGame = new Date(datacriacao)
    
    const mesAtual = dataHoje.getMonth()
    const anoAtual = dataHoje.getFullYear()
    
    const mesGame = dataCriacaoGame.getMonth()
    const anoGame = dataCriacaoGame.getFullYear()

    return mesAtual === mesGame && anoAtual === anoGame 
  }
  filtrarJogosMes(){
    const jogosMes = this.jogos().filter(jogo => {
      return this.dataCompare(jogo.createdAt)
    })
    return(jogosMes.length)
  }
  filtrarCategoriasMes(){
    const categoriasMes = this.categorias().filter(categoria => {
      return this.dataCompare(categoria.createdAt)
    })
    return(categoriasMes.length)
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
