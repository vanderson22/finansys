import { CategoryService } from './../shared/category.service';
import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../../shared/category.model';
import { switchMap } from 'rxjs/operators';
//importou tudo para uma variavel
import toastr from "toastr";



@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})

export class CategoryFormComponent implements OnInit, AfterContentChecked {

  /* edição ou novo
  */
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  /*acessório para impedir vários submit no botão*/
  submittingForm: boolean = false;
  category: Category = new Category();




  constructor(private http: HttpClient,
    private service: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formbuilder: FormBuilder) { }


  ngOnInit() {

    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();


  }

  submitForm() {
    this.submittingForm = true
    if (this.currentAction == 'new') {
      this.createCategory();
    } else {

      this.updateCategory();
    }

  }

  /**
   *    O assign atribui os valores do category form, 
   * excelente para utilizar quando temos muitos campos
   * **/
  createCategory() {

    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    
    //criar nova categoria.
    this.service.create(category).subscribe(
      category => {
        return this.actionsForSuccess(category);
      },
      error => {
        return this.actionsForError(error);
      }
    );
  }

  /**
   *  vai setar o pagetitle dinâmicamente após carregado.
   *   válido apenas edição
  */
  ngAfterContentChecked(): void {
    this.setPageTitle();
  }



  /**
   *  recupera o id da rota.
   *  e busca a categoria caso seja edição
   * **/
  loadCategory(): void {

    if (this.currentAction == "edit")

      this.route.paramMap.pipe(
        switchMap(params => this.service.getbyId(+params.get("id"))) // + é um cast
      ).subscribe(
        (category) => {
          this.category = category,
            //após recuperar a categoria do serviço, preencher o formulário para edição
            this.categoryForm.patchValue(this.category)
        },
        (error) => console.log("Ocorreu um erro no servidor")
      );
  }

  /**
   *  inicializando campos do formulário
   * ***/
  buildCategoryForm() {
    this.categoryForm = this.formbuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  /**
   *  Verifica qual ação está sendo executada
   * 
   * **/
  setCurrentAction() {
    this.currentAction = "edit"
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new"
    }
  }

  /**
   *   Seta o page title
   * 
   * **/
  private setPageTitle() {
    const categoryName = this.category.name || "";
    this.pageTitle = `Editando Categoria: ${categoryName}`

    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria"

  }


  private actionsForError(error): void {
    this.submittingForm = false; //habilitado para enviar o form novamente
    console.log(`Ocorreu um erro ao processar a requisição ${error}`);
    toastr.error(`Ocorreu um erro ao processar a requisição`);

    if (error.status == 422 || error.status == 404) {
      //unprocessing entity
      this.serverErrorMessages = JSON.parse(error._body).errors; //depende da estrutura do backend.
    } else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor remoto, por favor tente mais tarde."]
    }
  }

  private actionsForSuccess(category: Category): void {
    console.log("Sucesso na criação da categoria");
    toastr.success("Sucesso na criação da categoria");
    //forçando novo processamento - sem armazenar no historico
    // redireciona para categories
    // depois redireciona para categories/id/edit
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }
  private updateCategory() {
    throw new Error('Method not implemented.');
  }



}//Fim



