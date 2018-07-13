import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DisplayPaintingComponent } from "./display-painting/display-painting.component";
import { ShowPaintingsComponent } from "./show-paintings/show-paintings.component";

const routes: Routes = [
  { path: "displaypainting", component: DisplayPaintingComponent },
  { path: "showpaintings", component: ShowPaintingsComponent },
  {
    path: "",
    redirectTo: "displaypainting",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
