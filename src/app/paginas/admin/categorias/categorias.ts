import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from "../../../componentes/admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, CommonModule, AdminSidebar, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit{
  authservice = inject(AuthService)
  categoriasService  = inject(DashboardCategoriasService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  imagemselecionada: File | null = null
  imagemPreview: string | null = null;
  id: any
  categorias = signal<any[]>([])
  categoriasFiltradas = signal<any[]>([])
  isLoading = signal(false)
  filterForm = new FormGroup({
    categoryId : new FormControl(''),
    categoryName: new FormControl('')
  })
  ngOnInit(): void {
    this.getCategorias()
    this.filterForm.valueChanges.subscribe(() => {
      this.filtarCategoria();
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.categoriasService.getID(this.id).subscribe({
        next: (res) => {
          this.categoriaform.patchValue({
            name: res.data.name
          })
        }
      })
    }
    
  }
  getCategorias(){
    this.categoriasService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data.sort((a:any,b:any) => a.id - b.id))
        this.categoriasFiltradas.set(this.categorias())
        console.log('Dados Recebidos:',dados)
      },
      error: (erro) => {
        alert('Erro ao buscar os dados')
      }
    })
  }
  deletarCategoria(id: number){
    this.categoriasService.deletarCategoria(id).subscribe({
      next: () => {
        window.location.reload()
      },
      error: (erro) => {
        alert('Não foi possivel excluir a categoria')
        console.error('Erro ao deletar:', erro)
      }
    })
  }
  categoriaform = new FormGroup({
    name: new FormControl('',[Validators.required])
  })
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (!input.files?.length) {
      this.imagemselecionada = null;
      this.imagemPreview = null;
      return;
    }
  
    const file = input.files[0];
  
    if (!file.type.startsWith('image/')) {
      alert('Selecione apenas imagens.');
      return;
    }
  
    // Remove a URL anterior da memória
    if (this.imagemPreview) {
      URL.revokeObjectURL(this.imagemPreview);
    }
  
    this.imagemselecionada = file;
    this.imagemPreview = URL.createObjectURL(file);
  }
  onSubmit(): void {
    this.isLoading.set(true)
    const formData = new FormData()
    const values = this.categoriaform.value

    Object.entries(values).forEach(([Key, value]) =>{
      formData.append(Key, String(value))
    })

    if(this.imagemselecionada) {
      formData.append("image", this.imagemselecionada)
    }
    if(this.id){
      this.categoriasService.atualizarCategoria(formData, this.id).subscribe({
        next: (res) => {
          alert('Atualização Realizada')
          this.isLoading.set(false)
          this.router.navigate(['/Admin/Categorias'])
          
        },
        error: (err) =>{
          console.error(err)
          this.isLoading.set(false)
        }
      })
    } else{
      this.categoriasService.cadastrarCategoria(formData).subscribe({
        next: () => {
          alert("Publicado com sucesso!")
          this.isLoading.set(false)
          this.categoriaform.reset();
          this.imagemselecionada = null;
          this.getCategorias();
        },
        error: (err) =>{
          console.error(err)
          this.isLoading.set(false)
        }
      })
    }
  }
  filtarCategoria(){
    const {categoryId, categoryName} = this.filterForm.value
    let categorias = this.categorias()
    if(categoryId){
      categorias = categorias.filter(categoria => categoria.id == categoryId)
    }
    if(categoryName?.trim()){
      categorias = categorias.filter(categoria => categoria.name.toLowerCase().includes(categoryName.toLowerCase()))
    }
    this.categoriasFiltradas.set(categorias)
  }
}
