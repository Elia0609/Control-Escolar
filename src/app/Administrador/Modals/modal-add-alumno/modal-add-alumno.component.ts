import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService} from '../../Servicios/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-add-alumno',
  templateUrl: './modal-add-alumno.component.html',
  styleUrls: ['./modal-add-alumno.component.scss']
})
export class ModalAddAlumnoComponent{
  formulario: FormGroup;


  constructor(public dialogRef: MatDialogRef<ModalAddAlumnoComponent>, private fb: FormBuilder, private firestoreService: AdminService) {
    this.formulario = this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      ap: ['', Validators.required],
      am: ['', Validators.required],
      tel: ['', Validators.required],
      correo: ['', Validators.required],
      direccion: ['', Validators.required],
      curp: ['', Validators.required],
      fecha: ['', Validators.required],
      semestre: ['', Validators.required],
      grupo: ['', Validators.required],
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.formulario.valid) {
      const matricula = this.formulario.get('matricula')?.value;
      const rol = "Alumno";
      const pass = "password";

      const nombre = this.formulario.get('nombre')?.value;
      const ap = this.formulario.get('ap')?.value;
      const am = this.formulario.get('am')?.value;
      const correo = this.formulario.get('correo')?.value;
      const tel = this.formulario.get('tel')?.value;
      const direccion = this.formulario.get('direccion')?.value;
      const curp = this.formulario.get('curp')?.value;
      const fecha = this.formulario.get('fecha')?.value;
      const grupo = this.formulario.get('grupo')?.value;
      const semestre = this.formulario.get('semestre')?.value;
      const formData = { matricula, pass, rol };

      this.firestoreService.addUser(formData)
        .then(docRef => {
          const id = docRef.id;
          const formData2 = { nombre, ap, am, correo, tel, direccion, curp, fecha, matricula, grupo, semestre, rol};
          return this.firestoreService.addPersona(id, formData2);
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario',
            text: 'Alumno registrado'
          });
          this.dialogRef.close();
        })
        .catch(error => {
          console.error('Error writing document: ', error);
        });
    }
  }


}
