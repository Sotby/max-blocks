import { Component } from '@angular/core';
import { AdminNav } from "../../componentes/admin-nav/admin-nav";

@Component({
  selector: 'app-admin',
  imports: [AdminNav],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {}
