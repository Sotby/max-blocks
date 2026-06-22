import { Component } from '@angular/core';
import { BannerLateral } from '../../componentes/banner-lateral/banner-lateral';
@Component({
  selector: 'app-login',
  imports: [BannerLateral],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
