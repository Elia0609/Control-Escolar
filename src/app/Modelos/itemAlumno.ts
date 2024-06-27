export interface ItemAlumno {
  id?: string;
  nombre: string;
  ap: string;
  am: string;
  correo: string;
  tel: string;
  fecha: string;
  matricula: string;
  direccion: string;
  curp: string;
  grupo: string;
  semestre: string;
  [key: string]: string | undefined; 
}


