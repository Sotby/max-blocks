import { Component } from '@angular/core';
import { NavBar } from "../../componentes/nav-bar/nav-bar";
import { Footer } from "../../componentes/footer/footer";

@Component({
  selector: 'app-sobre-nos',
  imports: [NavBar, Footer],
  templateUrl: './sobre-nos.html',
  styleUrl: './sobre-nos.css',
})
export class SobreNos {}
