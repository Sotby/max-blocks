import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';

export const routes: Routes = [
    {path: 'Inicio', component: Inicio},
    {path: '', pathMatch: 'full', redirectTo: 'Inicio'},
    {path: '**', pathMatch: 'full', redirectTo: 'Inicio'}
];
