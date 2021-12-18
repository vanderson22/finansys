import { inMemoryDatabase } from './pages/in-memory-database';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

// interceptor para utilizar in-memory-web api


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
