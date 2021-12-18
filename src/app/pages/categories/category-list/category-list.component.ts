import { CategoryService } from './../shared/category.service';
import { Category } from './../../shared/category.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];


  constructor(private service : CategoryService ) { }


  /**
   *  Consulta on init lista de categorias 
   * 
   * **/
  ngOnInit() {

    this.service.getAll(

    ).subscribe(
      categories => this.categories = categories,
      error => console.log('Erro ao carregar a lista')
    )
  }

  deleteCategory(category: Category) {
    const mustDelete = confirm('Deseja realmente deletar este item?');

    if (mustDelete) {

      this.service.delete(category.id).subscribe(
        //precisa do filter, ou a página não atualiza corretamente !
        () => this.categories = this.categories.filter( e => e.id != category.id),
        () => console.log("Ocorreu um erro ao deletar a categoria")
        );
        
      }
  }

}
