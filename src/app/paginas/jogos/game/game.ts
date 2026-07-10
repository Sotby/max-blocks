import { Component, inject } from '@angular/core';
import { NavBar } from "../../../componentes/nav-bar/nav-bar";
import { DashboardJogosService } from '../../../core/services/dashboard.jogos.service';

@Component({
  selector: 'app-game',
  imports: [NavBar],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  jogoService = inject(DashboardJogosService)
}
