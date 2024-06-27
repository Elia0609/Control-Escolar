import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService} from '../../Servicios/admin.service';
import Swal from 'sweetalert2';
import { Item } from 'src/app/Modelos/temProfesor';

@Component({
  selector: 'app-edit-maestro',
  templateUrl: './edit-maestro.component.html',
  styleUrls: ['./edit-maestro.component.scss']
})
export class EditMaestroComponent implements OnInit {
  formulario: FormGroup;
  editingItem: Item | null = null;
  id_documento: any;
  Object: any;

  constructor(public dialogRef: MatDialogRef<EditMaestroComponent>, 
    private fb: FormBuilder, 
    private firestoreService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formulario = this.fb.group({
      nombre: [data.item.nombre, Validators.required],
      cedula: [data.item.cedula, Validators.required],
      ap: [data.item.ap, Validators.required],
      am: [data.item.am, Validators.required],
      correo: [data.item.correo, Validators.required],
      tel: [data.item.tel, Validators.required],
      especialidad: [data.item.especialidad, Validators.required],
      fecha: [data.item.fecha, Validators.required],
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.formulario.valid) {
      const cedula = this.formulario.get('cedula')?.value;
      const nombre = this.formulario.get('nombre')?.value;
      const ap = this.formulario.get('ap')?.value;
      const am = this.formulario.get('am')?.value;
      const correo = this.formulario.get('correo')?.value;
      const tel = this.formulario.get('tel')?.value;
      const especialidad = this.formulario.get('especialidad')?.value;
      const fecha = this.formulario.get('fecha')?.value;
      this.id_documento = this.data.item.id;
      
      this.editingItem = { nombre, ap, am, correo, tel, especialidad, fecha, cedula };
      if (this.editingItem) {
        this.firestoreService.updateItem(this.id_documento, this.editingItem).then(() => {
          this.editingItem = null;
          Swal.fire('Actualizado', 'El elemento ha sido actualizado.', 'success');
          this.dialogRef.close();
        }).catch(error => {
          Swal.fire('Error', 'Hubo un problema al actualizar el elemento.', 'error');
          console.error('Error updating item: ', error);
        });
      }
    }
  }

  ngOnInit() {
  }

}
