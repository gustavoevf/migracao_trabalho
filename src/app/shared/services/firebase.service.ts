import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, user } from '@angular/fire/auth';
import { doc, Firestore, getDocs, query, setDoc, deleteDoc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private router: Router,
    @Inject(Auth) private _fireAuth: Auth,
    @Inject(Firestore) private _fireStore: Firestore,
    @Inject(FirebaseApp) private _firebaseApp: FirebaseApp,

  ) {
    this._fireAuth.onAuthStateChanged(() => {
      if (!user) {
        this.router.navigate(['login']);
      }
    })
  }

  loginUsuarioSenha(email: string, senha: string) {
    return signInWithEmailAndPassword(this._fireAuth, email, senha);
  }

  sair() {
    this._fireAuth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  async get(colecao: string) {
    var q = query(collection(this._fireStore, colecao));
    return await getDocs(q);
  }

  async post(documento: any, colecao: string) {
    return await addDoc(collection(this._fireStore, colecao), documento);
  }

  async delete(idDocumento: string, colecao: string) {
    return await deleteDoc(doc(this._fireStore, colecao + "/" + idDocumento));
  }

  async update(documentoRef: any, documento: any) {
    return await updateDoc(documentoRef, documento);
  }

}
