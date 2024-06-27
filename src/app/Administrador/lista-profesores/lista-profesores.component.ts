import { Component, OnInit } from '@angular/core';
import { ModalAddMaestroComponent } from '../Modals/modal-add-maestro/modal-add-maestro.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminService} from '../Servicios/admin.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { EditMaestroComponent } from '../Modals/edit-maestro/edit-maestro.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Item } from 'src/app/Modelos/temProfesor';

@Component({
  selector: 'app-lista-profesores',
  templateUrl: './lista-profesores.component.html',
  styleUrls: ['./lista-profesores.component.scss']
})
export class ListaProfesoresComponent implements OnInit {
  items: Item[] = [];
  editingItem: Item | null = null;
  id_documento: any;
  filteredItems: Item[] = []; // Lista filtrada de items
  searchForm: FormGroup;

  constructor(public dialog: MatDialog, private firestoreService: AdminService, private fb: FormBuilder) { 
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit() {
    this.firestoreService.getItems("Profesor").subscribe(items => {
      this.items = items;
      this.filteredItems = [...items];
      if (items.length > 0) {
        this.id_documento = items[0].id;
      }
    });

    this.searchForm.get('search')?.valueChanges.subscribe(value => {
      this.filterItems(value);
    });

  }

  filterItems(searchTerm: string) {
    if (!searchTerm) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.am.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tel.includes(searchTerm) ||
        item.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fecha.includes(searchTerm)
      );
    }
  }

  editItem(item: Item) {
    const dialogRef = this.dialog.open(EditMaestroComponent, {
      width: '500px',
      height: '610px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(ModalAddMaestroComponent, {
      width: '500px',
      height: '610px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });
  }

  exportToExcel() {
    const formattedData = this.items.map(({ am, ap, especialidad, fecha, tel, nombre, cedula, correo }) => ({
      Cedula: cedula,
      Nombre: nombre,
      Apellido_Paterno: ap,
      Apellido_Materno: am,
      Especialidad: especialidad,
      Telefono: tel,
      Correo: correo,
      Fecha_de_Nacimiento: fecha
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profesores');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Lista_Profesores');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export.xlsx`);
  }


  deleteItem(id: string | undefined) {
    if (id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          this.firestoreService.deleteItem(this.id_documento).then(() => {
            Swal.fire('Eliminado', 'El elemento ha sido eliminado.', 'success');
          }).catch(error => {
            Swal.fire('Error', 'Hubo un problema al eliminar el elemento.', 'error');
            console.error('Error deleting item: ', error);
          });
        }
      });
    }
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';