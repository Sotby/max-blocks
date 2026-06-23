import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Cadastro } from './paginas/auth/cadastro/cadastro';
import { Login } from './paginas/auth/login/login';
import {ErrorPage} from './paginas/system/error-page/error-page';
import {Jogos} from './paginas/jogos/jogos';
import {SobreNos} from './paginas/sobre-nos/sobre-nos';
export const routes: Routes = [
    {path: 'Inicio', component: Inicio},
    {path: 'inicio', component: Inicio},
    {path: 'Cadastro', component: Cadastro},
    {path: 'cadastro', redirectTo: 'Cadastro'},
    {path: 'Login', component: Login},
    {path: 'login', redirectTo:'Login'},
    {path: 'Jogos',component:Jogos},
    {path: 'jogos', redirectTo:'Categorias'},
    {path: 'Sobre-Nos',component:SobreNos},
    {path:'sobre-nos',redirectTo:'Sobre-Nos'},
    {path: '**', pathMatch: 'full', component: ErrorPage}
];
