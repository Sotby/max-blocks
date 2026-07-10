import { Component} from '@angular/core';
import { AdminSidebar } from "../../componentes/admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-perfil',
  imports: [AdminSidebar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {}
