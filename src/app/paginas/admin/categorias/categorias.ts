import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardCategoriasService } from '../../../core/services/dashboard.categorias.service';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from "../../../componentes/admin-sidebar/admin-sidebar";
import { Loading } from "../../../componentes/loading/loading";

@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, CommonModule, AdminSidebar, RouterLink, Loading],
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
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id'))
      if(this.id){
      this.categoriasService.getID(this.id).subscribe({
        next: (res) => {
          console.log("Dados: ",res)
          this.categoriaform.patchValue({
            name: res.data.name
          })
          this.imagemPreview = res.data.image_url
        }
      })
    }
    })
  }
  getCategorias(){
    this.isLoading.set(true)
    this.categoriasService.getALL().subscribe({
      next: (dados) => {
        this.categorias.set(dados.data.sort((a:any,b:any) => a.id - b.id))
        this.categoriasFiltradas.set(this.categorias())
        this.isLoading.set(false)
      },
      error: (erro) => {
        alert('Erro ao buscar os dados')
        this.isLoading.set(false)
      }
    })
  }
  deletarCategoria(id: number){
    this.isLoading.set(true)
    this.categoriasService.deletarCategoria(id).subscribe({
      next: () => {
        this.isLoading.set(false)
        this.categoriasFiltradas.set(this.categoriasFiltradas().filter((category:any)=> category.id !== id))
      },
      error: (erro) => {
        alert('Não foi possivel excluir a categoria')
        this.isLoading.set(false)
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
          this.isLoading.set(false)
          alert("Erro ao atualizar a categoria")
        }
      })
    } else{
      this.categoriasService.cadastrarCategoria(formData).subscribe({
        next: () => {
          alert("Publicado com sucesso!")
          this.getCategorias();
          this.isLoading.set(false)
          this.categoriaform.reset();
          this.imagemselecionada = null;
          this.limparForm()
        },
        error: (err) =>{
          this.isLoading.set(false)
        }
      })
    }
  }
  limparForm(){
    this.categoriaform.reset({
      name: ''
    })
    this.imagemPreview = null
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
