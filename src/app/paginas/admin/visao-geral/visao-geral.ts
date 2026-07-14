import { Component, inject, OnInit, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
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
export class VisaoGeral implements OnInit, AfterViewInit {
  authservice = inject(AuthService);
  jogosService = inject(DashboardJogosService);
  categoriasService = inject(DashboardCategoriasService)
  jogos = signal<any[]>([]);
  categorias = signal<any[]>([])
  dadosCarregados = signal(false)
  chart!: Chart;
  @ViewChild('grafico') grafico!: ElementRef<HTMLCanvasElement>;
  ngOnInit(): void {
    this.getJogos();
    this.getCategorias();
  }
  ngAfterViewInit(): void {
    if (this.dadosCarregados()) {
      this.criarGrafico();
    }
  }
  criarGrafico() {
    this.chart = new Chart(this.grafico.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro'
        ],
        datasets: [
          {
            label: 'Jogos lançados',
            data: this.quantidadeJogosPorMes(),
            backgroundColor: [
              '#ef4444', // Janeiro
              '#f97316', // Fevereiro
              '#eab308', // Março
              '#22c55e', // Abril
              '#06b6d4', // Maio
              '#3b82f6', // Junho
              '#6366f1', // Julho
              '#8b5cf6', // Agosto
              '#ec4899', // Setembro
              '#f43f5e', // Outubro
              '#14b8a6', // Novembro
              '#84cc16'  // Dezembro
            ]
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }
  getJogos() {
    this.jogosService.getALL().subscribe({
      next: (dados) => {
        this.jogos.set(dados.data);
  
        this.dadosCarregados.set(true);
  
        setTimeout(() => {
          if (this.grafico) {
            this.criarGrafico();
          }
        });
      },
      error: () => {
        alert('Erro ao buscar os dados');
      },
    });
  }
  getCategorias(){
    this.categoriasService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data);
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
  quantidadeJogosPorMes() {
    const meses = Array(12).fill(0);
  
    this.jogos().forEach(jogo => {
      const data = new Date(jogo.createdAt);
      const mes = data.getMonth(); // Janeiro = 0, Fevereiro = 1...
  
      meses[mes]++;
    });
    console.log(meses);
    return meses;
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
