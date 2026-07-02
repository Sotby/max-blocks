import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Cadastro } from './paginas/auth/cadastro/cadastro';
import { Login } from './paginas/auth/login/login';
import {ErrorPage} from './paginas/system/error-page/error-page';
import {ListaJogos} from './paginas/jogos/lista-jogos/lista-jogos';
import {SobreNos} from './paginas/sobre-nos/sobre-nos';
import { Perfil } from './paginas/perfil/perfil';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {path: 'Inicio', component: Inicio},
    {path: 'inicio', redirectTo: 'Inicio'},
    {path: '', redirectTo:'Inicio', pathMatch:'full'},
    {path: 'Cadastro', component: Cadastro},
    {path: 'cadastro', redirectTo: 'Cadastro'},
    {path: 'Login', component: Login},
    {path: 'login', redirectTo:'Login'},
    {path: 'Jogos',component:ListaJogos},
    {path: 'jogos', redirectTo:'Categorias'},
    {path: 'Sobre-Nos',component:SobreNos},
    {path:'sobre-nos',redirectTo:'Sobre-Nos'},
    {path: 'Perfil', canActivate:[authGuard], component:Perfil},
    {path: 'perfil',redirectTo:'Perfil'},
    {path: '**', pathMatch: 'full', component: ErrorPage}
];
