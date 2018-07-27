import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShowPaintingsComponent } from "./show-paintings/show-paintings.component";
import { PaintingGalleryComponent } from "./painting-gallery/painting-gallery.component";
import { FaceComponent } from "./face/face.component";

const routes: Routes = [
  { path: "showpaintings", component: ShowPaintingsComponent },
  { path: "gallery", component: PaintingGalleryComponent },
  { path: "face", component: FaceComponent },
  {
    path: "",
    redirectTo: "gallery",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
