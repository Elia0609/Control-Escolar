import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdminService} from '../Servicios/admin.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ModalAddAlumnoComponent } from '../Modals/modal-add-alumno/modal-add-alumno.component';
import { ItemAlumno } from 'src/app/Modelos/itemAlumno';
import Swal from 'sweetalert2';
import { ModalEditAlumnoComponent } from '../Modals/modal-edit-alumno/modal-edit-alumno.component';
import { Usuarios } from 'src/app/Modelos/Usuarios';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {

  items: ItemAlumno[] = [];
  itemsExcel: ItemAlumno[] = [];
  itemsAddUser: Usuarios[] = [];
  editingItem: ItemAlumno | null = null;
  id_documento: any;
  filteredItems: ItemAlumno[] = [];
  searchForm: FormGroup;
  isFilteringBySelect: boolean = false;

  constructor(public dialog: MatDialog, private firestoreService: AdminService, private fb: FormBuilder) { 
    this.searchForm = this.fb.group({
      search: [''],
      semestre: [''],
      grupo: ['']
    });
    this.searchForm.valueChanges.subscribe(value => {
      this.filterItems();
    });
  }

  ngOnInit(): void {
    this.firestoreService.getItemsAlumno("Alumno").subscribe(items => {
      this.items = items;
      console.log(this.items );
      this.filteredItems = [...items];
      if (items.length > 0) {
        this.id_documento = items[0].id;
      }
    });


    this.searchForm.valueChanges.subscribe(value => {
      this.filterItems();
    });
  }

  filterItems() {
    const { search, semestre, grupo } = this.searchForm.value;

    this.filteredItems = this.items.filter(item => {
      const matchesSearch = !search || 
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.ap.toLowerCase().includes(search.toLowerCase()) ||
        item.am.toLowerCase().includes(search.toLowerCase()) ||
        item.correo.toLowerCase().includes(search.toLowerCase()) ||
        item.tel.includes(search) ||
        item.curp.toLowerCase().includes(search.toLowerCase()) ||
        item.matricula.toLowerCase().includes(search.toLowerCase()) ||
        item.direccion.includes(search);
      const matchesSemestre = !semestre || item.semestre === semestre.toString();
      const matchesGrupo = !grupo || item.grupo.toLowerCase() === grupo.toLowerCase();
      return matchesSearch && matchesSemestre && matchesGrupo;
    });
  }

  editItem(item: ItemAlumno) {
    const dialogRef = this.dialog.open(ModalEditAlumnoComponent, {
      width: '600px',
      height: '550px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  exportToExcel() {
    const formattedData = this.items.map(({nombre, ap, am, correo, tel, direccion, curp, fecha, matricula, grupo, semestre}) => ({
      Matricula: matricula,
      Nombre: nombre,
      Apellido_Paterno: ap,
      Apellido_Materno: am,
      CURP: curp,
      Semestre: semestre,
      Grupo: grupo,
      Telefono: tel,
      Correo: correo,
      Direccion: direccion,
      Fecha_de_Nacimiento: fecha
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Lista_Alumnos');
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
          this.firestoreService.deleteItemAlumno(this.id_documento).then(() => {
            Swal.fire('Eliminado', 'El elemento ha sido eliminado.', 'success');
          }).catch(error => {
            Swal.fire('Error', 'Hubo un problema al eliminar el elemento.', 'error');
            console.error('Error deleting item: ', error);
          });
        }
      });
    }
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(ModalAddAlumnoComponent, {
      width: '600px',
      height: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
      this.searchForm.patchValue({
        semestre: '',
        grupo: ''
      });
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(evt: any): void {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];   
      const data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));    
      
      const importarPersona: ItemAlumno[] = data.slice(1).map((row: any) => ({
        matricula: row[0],
        nombre: row[1],
        ap: row[2],
        am: row[3],
        curp: row[4],
        semestre: row[5],
        grupo: row[6],
        tel: row[7],
        correo: row[8],
        direccion: row[9],
        fecha: row[10],
        rol: "Alumno"
      }));  
      
      const importarUsuarios: Usuarios[] = data.slice(1).map((row: any) => ({
        matricula: row[0],
        rol: "Alumno",
        pass: "password"
      }));
     
      // Agregar usuarios y personas a Firebase
      const promises = importarUsuarios.map((usuario, index) => {
        return this.firestoreService.addUser(usuario)
          .then(docRef => {
            const id = docRef.id;
            const persona: ItemAlumno = importarPersona[index];
            Object.keys(persona).forEach(key => {
              if (persona[key] === undefined) {
                persona[key] = ''; 
              }
            });
            // Agregar persona a Firebase
            return this.firestoreService.addPersona(id, persona);
          });
      });
  
      // Esperar a que todas las promesas se resuelvan
      Promise.all(promises)
        .then(() => {
          Swal.fire('Alumnos', 'Los alumnos fueron agregados correctamente', 'success');
        })
        .catch(error => {
          Swal.fire('Error', 'Hubo un error al agregar los alumnos', 'error');
        });
    };
    reader.readAsBinaryString(target.files[0]);
  }
  

}


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';