import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _documentId = new BehaviorSubject<string | null>(null);
  private role: any;

  constructor(private firestore: AngularFirestore) {
    this.loadDocumentId();
  }
  
  async getRol(id: string, variableKey: string): Promise<any> {
    const docRef = this.firestore.collection("Usuarios").doc(id);
    const docSnap = await docRef.get().toPromise();
    
    if (docSnap && docSnap.exists) {
      return docSnap.get(variableKey);
    } else {
      console.log("El documento no existe");
      return null;
    }
  }

  getDocument(email: string, password: string, rol: string): Observable<string | null> {
    this.role = rol;
    if (!email || !password || !rol) {
      return of(null);
    }
    return this.firestore.collection("Usuarios", ref =>
      ref.where('usuario', '==', email).where('pass', '==', password).where('rol', '==', rol))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const doc = actions.length > 0 ? actions[0].payload.doc : null;
          this.documentId = doc ? doc.id : null;
          return this.documentId;
        })
      );
  }

  get documentId$() {
    return this._documentId.asObservable();
  }

  get documentId(): any {
    return this._documentId.value;
  }

  set documentId(id: string | null) {
    this._documentId.next(id);
    this.saveDocumentId();
  }

  private loadDocumentId(): void {
    const storedId = localStorage.getItem('documentId');
    if (storedId) {
      this._documentId.next(storedId);
    }
  }

  private saveDocumentId(): void {
    const id = this._documentId.value;
    if (id) {
      localStorage.setItem('documentId', id);
    } else {
      localStorage.removeItem('documentId');
    }
  }

  logout(): void {
    this.documentId = null;
  }
}