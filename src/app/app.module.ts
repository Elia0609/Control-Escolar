import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyComponent } from './Principales/body/body.component';
import { NavbarComponent } from './Principales/navbar/navbar.component';
import { LoginComponent } from './Principales/login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ListaAlumnosComponent } from './Administrador/lista-alumnos/lista-alumnos.component';
import { ListaProfesoresComponent } from './Administrador/lista-profesores/lista-profesores.component';
import { ModalAddMaestroComponent } from './Administrador/Modals/modal-add-maestro/modal-add-maestro.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditMaestroComponent } from './Administrador/Modals/edit-maestro/edit-maestro.component';
import { ModalAddAlumnoComponent } from './Administrador/Modals/modal-add-alumno/modal-add-alumno.component';
import { ModalEditAlumnoComponent } from './Administrador/Modals/modal-edit-alumno/modal-edit-alumno.component';
import { EventosComponent } from './Administrador/eventos/eventos.component';
import { AddEventoComponent } from './Administrador/Modals/add-evento/add-evento.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ImprimirCredencialesComponent } from './Administrador/imprimir-credenciales/imprimir-credenciales.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    NavbarComponent,
    LoginComponent,
    ListaAlumnosComponent,
    ListaProfesoresComponent,
    ModalAddMaestroComponent,
    EditMaestroComponent,
    ModalAddAlumnoComponent,
    ModalEditAlumnoComponent,
    EventosComponent,
    AddEventoComponent,
    ImprimirCredencialesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FullCalendarModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
