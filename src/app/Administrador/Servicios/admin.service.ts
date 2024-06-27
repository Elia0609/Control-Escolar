import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Item } from 'src/app/Modelos/temProfesor';
import { ItemAlumno } from 'src/app/Modelos/itemAlumno';
import { Event } from 'src/app/Modelos/eventos';

export interface person {
  rol: string;
  usuario: string; 
  contrasena: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private itemsCollection!: AngularFirestoreCollection<Item>; 
  private itemsAlumnos!: AngularFirestoreCollection<ItemAlumno>;
  private itemsCollection2!: AngularFirestoreCollection<person>;
  items$!: Observable<Item[]>;
  items2!: Observable<ItemAlumno[]>;

  constructor(private firestore: AngularFirestore) { }

  //Genarl para registrar Maestros y alumnos
  addUser(data: any) {
    return this.firestore.collection("Usuarios").add(data);
  }
  addPersona(id: string, data: any) {
    return this.firestore.collection("Persona").doc(id).set(data);
  }

  //Obtener y crear las tablas para maestros y alumnos
  getItems(desiredRole: string): Observable<Item[]> {
    this.Creartabla(desiredRole);
    return this.items$;
  }
  getItemsAlumno(desiredRole: string): Observable<ItemAlumno[]> {
    this.CreartablaAlumnos(desiredRole);
    return this.items2;
  }
  Creartabla(desiredRole: string) {
    this.itemsCollection = this.firestore.collection<Item>('Persona', ref => 
      ref.where('rol', '==', desiredRole)
    );
    this.items$ = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  CreartablaAlumnos(desiredRole: string) {
    this.itemsAlumnos = this.firestore.collection<ItemAlumno>('Persona', ref => 
      ref.where('rol', '==', desiredRole)
    );
    this.items2 = this.itemsAlumnos.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ItemAlumno;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  //Editar informacion 
  updateItem(id: string, item: Item): Promise<void> {
    this.itemsCollection = this.firestore.collection<Item>('Persona');
    return this.itemsCollection.doc(id).update(item);
  }
  updateItemAlumno(id: string, item: ItemAlumno): Promise<void> {
    this.itemsAlumnos = this.firestore.collection<ItemAlumno>('Persona');
    return this.itemsAlumnos.doc(id).update(item);
  }

  //Eliminar informacion 
  deleteItem(id: string): Promise<void> {
    this.itemsCollection = this.firestore.collection<Item>('Persona');
    this.itemsCollection2 = this.firestore.collection<person>('Usuarios');

    const deleteFromCollection1 = this.itemsCollection.doc(id).delete();
    const deleteFromCollection2 = this.itemsCollection2.doc(id).delete();

    return Promise.all([deleteFromCollection1, deleteFromCollection2]).then(() => {
      console.log('Both deletions completed');
    }).catch(error => {
      console.error('Error deleting documents: ', error);
    });
  }
  deleteItemAlumno(id: string): Promise<void> {
    this.itemsAlumnos = this.firestore.collection<ItemAlumno>('Persona');
    this.itemsCollection2 = this.firestore.collection<person>('Usuarios');

    const deleteFromCollection1 = this.itemsAlumnos.doc(id).delete();
    const deleteFromCollection2 = this.itemsCollection2.doc(id).delete();

    return Promise.all([deleteFromCollection1, deleteFromCollection2]).then(() => {
      console.log('Both deletions completed');
    }).catch(error => {
      console.error('Error deleting documents: ', error);
    });
  }

  //Lista de eventos

  addEvent(event: Event): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('Eventos').doc(id).set({ ...event, id });
  }

  getEventsByMonth(month: string): Observable<Event[]> {
    const startOfMonth = `${month}-01`;
    const endOfMonth = `${month}-31`;

    return this.firestore.collection<Event>('Eventos', ref =>
      ref.where('date', '>=', startOfMonth)
         .where('date', '<=', endOfMonth)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Event;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
