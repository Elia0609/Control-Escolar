import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService} from '../../Servicios/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-add-maestro',
  templateUrl: './modal-add-maestro.component.html',
  styleUrls: ['./modal-add-maestro.component.scss']
})
export class ModalAddMaestroComponent {
  formulario: FormGroup;


  constructor(public dialogRef: MatDialogRef<ModalAddMaestroComponent>, private fb: FormBuilder, private firestoreService: AdminService) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      ap: ['', Validators.required],
      am: ['', Validators.required],
      correo: ['', Validators.required],
      tel: ['', Validators.required],
      especialidad: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.formulario.valid) {
      const cedula = this.formulario.get('cedula')?.value;
      const rol = "Profesor";
      const pass = "password";

      const nombre = this.formulario.get('nombre')?.value;
      const ap = this.formulario.get('ap')?.value;
      const am = this.formulario.get('am')?.value;
      const correo = this.formulario.get('correo')?.value;
      const tel = this.formulario.get('tel')?.value;
      const especialidad = this.formulario.get('especialidad')?.value;
      const fecha = this.formulario.get('fecha')?.value;
      const formData = { cedula, pass, rol };

      this.firestoreService.addUser(formData)
        .then(docRef => {
          const id = docRef.id;
          const formData2 = { nombre, ap, am, correo, tel, especialidad, fecha, cedula, rol};
          return this.firestoreService.addPersona(id, formData2);
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario',
            text: 'Usuario registrado'
          });
          this.dialogRef.close();
        })
        .catch(error => {
          console.error('Error writing document: ', error);
        });
    }
  }


  
}
