import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Principales/body/body.component';
import { LoginComponent } from './Principales/login/login.component';
import { ListaAlumnosComponent } from './Administrador/lista-alumnos/lista-alumnos.component';
import { ListaProfesoresComponent } from './Administrador/lista-profesores/lista-profesores.component';
import { EventosComponent } from './Administrador/eventos/eventos.component';
import { ImprimirCredencialesComponent } from './Administrador/imprimir-credenciales/imprimir-credenciales.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'body', component: BodyComponent},
  {path: 'login', component: LoginComponent},
  {path: 'ListaAlumnos', component: ListaAlumnosComponent},
  {path: 'login', component: LoginComponent},
  {path: 'ListaProfesores', component: ListaProfesoresComponent},
  {path: 'Eventos', component: EventosComponent},
  {path: 'Credenciales', component: ImprimirCredencialesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
