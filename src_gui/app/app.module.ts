import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayPaintingComponent } from './display-painting/display-painting.component';
import { ShowPaintingsComponent } from './show-paintings/show-paintings.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayPaintingComponent,
    ShowPaintingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
