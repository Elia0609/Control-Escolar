import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../Servicios/admin.service';
import { AddEventoComponent } from '../Modals/add-evento/add-evento.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment'; 

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit, AfterViewInit {

  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short' // Configuración para mostrar AM/PM
    },
    locale: 'es',
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    datesSet: this.loadEvents.bind(this)
  };
  

  constructor(private firebaseService: AdminService, public dialog: MatDialog) { }

  openAddEventModal(): void {
    const dialogRef = this.dialog.open(AddEventoComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar evento se cerró');
      this.loadEvents(); // Refrescar la lista de eventos después de agregar un nuevo evento
    });
  }

  ngOnInit() {
  
  }

  ngAfterViewInit() {
    this.loadEvents();
  }

  loadEvents() {
    const currentMonth = this.getCurrentMonth();
    this.firebaseService.getEventsByMonth(currentMonth).subscribe(events => {
      const newEvents = events.map(event => ({
        title: event.title,
        start: moment(`${event.date}T${event.time}`).format(), // Formato de fecha y hora usando moment.js
        borderColor: '#ffb703', 

      }));
      console.log(newEvents);
      this.fullcalendar.getApi().removeAllEvents();
      this.fullcalendar.getApi().addEventSource(newEvents);
      this.fullcalendar.getApi().refetchEvents(); 
    });
  }
  
  getFormattedTime(time: string): string {
    const hourMinute = time.split(':');
    let hour = parseInt(hourMinute[0], 10);
    const minute = hourMinute[1];
    let meridiem = 'AM';
    if (hour >= 12) {
      meridiem = 'PM';
      if (hour > 12) {
        hour -= 12;
      }
    }
    return `${hour}:${minute} ${meridiem}`;
  }
  
  getCurrentMonth(): string {
    const date = new Date(this.fullcalendar.getApi().getDate());
    const month = date.getMonth() + 1; // Los meses en JavaScript son de 0-11
    const year = date.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}`;
  }



}
