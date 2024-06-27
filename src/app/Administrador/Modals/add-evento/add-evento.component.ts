import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Servicios/admin.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Event } from 'src/app/Modelos/eventos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-evento',
  templateUrl: './add-evento.component.html',
  styleUrls: ['./add-evento.component.scss']
})
export class AddEventoComponent implements OnInit {

  event: Event = {
    title: '',
    date: '',
    time: '',
  };

  constructor(public dialogRef: MatDialogRef<AddEventoComponent>,
    private eventService: AdminService) { }

  ngOnInit(): void {
  }

  addEvent(): void {
    this.eventService.addEvent(this.event)
      .then(() => {
        Swal.fire('Evento', 'El evento fue agregado correctamente', 'success');
        this.dialogRef.close();
      })
      .catch(error => {
        Swal.fire('Error', 'Hubo un error al agregar el evento: ' + error.message, 'error');
      });
  }

  close(): void {
    this.dialogRef.close();
  }

}
