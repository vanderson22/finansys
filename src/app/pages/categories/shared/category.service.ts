import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators'
import { Category } from '../../shared/category.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "http://localhost:8080/api/categories"; // "api/categories";


  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getbyId(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(map(this.jsonToCategory));
  }


  delete(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(catchError(this.handleError)
      , map(() => null)
    );
  }

   create(category: Category) : Observable<Category>{

    return this.http.post(this.apiPath, category).pipe(
      map(this.jsonToCategory)
    );
   }

  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`;


    return this.http.put(url ,  category).pipe(
      map(() => category)
      // map(this.jsonToCategory)
    );
  }

 


  jsonToCategory(category: any): Category {
    //apenas um cast
    return category as Category;
  }



  handleError(e: any): Observable<any> {
    console.log("Erro na requisição => ", e);
    return throwError(e);
  }

  private jsonDataToCategories(json: any[]): Category[] {
    const categories: Category[] = [];
    json.forEach(e => categories.push(e as Category))
    return categories;
  }
}
