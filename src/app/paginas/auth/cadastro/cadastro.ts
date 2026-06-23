import { Component } from '@angular/core';
import { BannerLateral } from "../../../componentes/banner-lateral/banner-lateral";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cadastro',
  imports: [BannerLateral, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {}
