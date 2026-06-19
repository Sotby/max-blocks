import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Cadastro } from './paginas/cadastro/cadastro';
import { Login } from './paginas/login/login';

export const routes: Routes = [
    {path: 'Inicio', component: Inicio},
    {path: 'Cadastro', component: Cadastro},
    {path: 'Login', component: Login},
    {path: '**', pathMatch: 'full', redirectTo: 'Inicio'}
];
