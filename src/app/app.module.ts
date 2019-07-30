import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowPaintingsComponent } from "./show-paintings/show-paintings.component";
import { PaintingGalleryComponent } from "./painting-gallery/painting-gallery.component";
import { PaintingGalleryItemComponent } from "./painting-gallery-item/painting-gallery-item.component";
import { PaginatorModule } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { NavigationButtonComponent } from './navigation-button/navigation-button.component';
@NgModule({
  declarations: [
    AppComponent,
    ShowPaintingsComponent,
    PaintingGalleryComponent,
    PaintingGalleryItemComponent,
    NavigationButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PaginatorModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
