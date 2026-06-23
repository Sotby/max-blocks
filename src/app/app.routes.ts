import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Cadastro } from './paginas/cadastro/cadastro';
import { Login } from './paginas/login/login';
import {ErrorPage} from './paginas/error-page/error-page';
import {Categorias} from './paginas/categorias/categorias';
import {SobreNos} from './paginas/sobre-nos/sobre-nos';
export const routes: Routes = [
    {path: 'Inicio', component: Inicio},
    {path: 'inicio', component: Inicio},
    {path: 'Cadastro', component: Cadastro},
    {path: 'cadastro', redirectTo: 'Cadastro'},
    {path: 'Login', component: Login},
    {path: 'login', redirectTo:'Login'},
    {path: 'Categorias',component:Categorias},
    {path: 'categorias', redirectTo:'Categorias'},
    {path: 'Sobre-Nos',component:SobreNos},
    {path:'sobre-nos',redirectTo:'Sobre-Nos'},
    {path: '**', pathMatch: 'full', component: ErrorPage}
];
