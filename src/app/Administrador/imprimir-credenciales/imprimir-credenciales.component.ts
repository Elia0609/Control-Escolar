import { Component, OnInit } from '@angular/core';
import { AdminService } from '../Servicios/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemAlumno } from 'src/app/Modelos/itemAlumno';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-imprimir-credenciales',
  templateUrl: './imprimir-credenciales.component.html',
  styleUrls: ['./imprimir-credenciales.component.scss']
})
export class ImprimirCredencialesComponent implements OnInit {

  items: ItemAlumno[] = [];

  constructor(private firestoreService: AdminService, private fb: FormBuilder) { 

  }

  ngOnInit(): void {
    this.firestoreService.getItemsAlumno("Alumno").subscribe(items => {
      this.items = items;
      console.log(this.items );
    });
  }

  generarPDF(item: ItemAlumno): void {
    const data = document.getElementById('contentToConvert')!;
    
    html2canvas(data).then(canvas => {
      const imgWidth = 86; // Ancho de la credencial en mm
      const imgHeight = 54; // Alto de la credencial en mm
      const pageHeight = imgHeight; // Alto de la página del PDF, igual al alto de la credencial
  
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', [imgWidth, imgHeight]); // Configurar el PDF a las dimensiones de una credencial
  
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${item.nombre}_${item.matricula}.pdf`); // Nombre del archivo PDF
    });
  }
  

}
