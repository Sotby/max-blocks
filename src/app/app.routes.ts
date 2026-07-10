import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Cadastro } from './paginas/auth/cadastro/cadastro';
import { Login } from './paginas/auth/login/login';
import {ErrorPage} from './paginas/system/error-page/error-page';
import {ListaJogos} from './paginas/jogos/lista-jogos/lista-jogos';
import {SobreNos} from './paginas/sobre-nos/sobre-nos';
import { Perfil } from './paginas/perfil/perfil';
import { authGuard } from './core/guards/auth-guard';
import { Jogos } from './paginas/admin/jogos/jogos';
import { Categorias } from './paginas/admin/categorias/categorias';
import { VisaoGeral } from './paginas/admin/visao-geral/visao-geral';
import { Game } from './paginas/jogos/game/game';

export const routes: Routes = [
    {path: 'Inicio', component: Inicio},
    {path: 'Cadastro', component: Cadastro},
    {path: 'Login', component: Login},
    {path: 'Jogos',component:ListaJogos},
    {path: 'jogos/game/:id', component: Game},
    {path: 'Sobre-Nos',component:SobreNos},
    {path: 'inicio', redirectTo: 'Inicio', pathMatch:'full'},
    {path: 'cadastro', redirectTo: 'Cadastro', pathMatch: 'full'},
    {path: 'login', redirectTo:'Login', pathMatch: 'full'},
    {path: 'jogos', redirectTo:'Categorias', pathMatch: 'full'},
    {path:'sobre-nos',redirectTo:'Sobre-Nos', pathMatch:'full'},
    {path: 'Perfil', canActivate:[authGuard], component:Perfil},
    {path: 'Admin',canActivate:[authGuard], children:[
        {path: 'Geral', component: VisaoGeral},
        {path: 'Jogos',component:Jogos},
        {path: 'Jogos/Editar/:id', component:Jogos},
        {path: 'Categorias', component:Categorias},
        {path: 'Categorias/Editar/:id', component:Categorias},
        {path: 'jogos', redirectTo:'Jogos', pathMatch:'full'},
        {path: 'categorias', redirectTo:'Categorias', pathMatch:'full'},
        {path: 'geral', redirectTo:'Geral', pathMatch:'full'},
        {path: '', redirectTo:'Geral', pathMatch:'full'}
    ]},
    {path: '', redirectTo:'Inicio', pathMatch:'full'},
    {path: '**', pathMatch: 'full', component: ErrorPage}
];
