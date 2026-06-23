import { Component } from '@angular/core';
import { BannerLateral } from "../../../componentes/banner-lateral/banner-lateral";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [BannerLateral, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
