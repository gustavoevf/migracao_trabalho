import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuariosComponent,
    ProdutosComponent,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    SweetAlert2Module.forRoot({
      provideSwal: () => import('sweetalert2').then(({ default: swal }) => swal.mixin({
        toast: true,    
        position: 'top-end',
        showConfirmButton: false,    
        timer: 3000,    
        timerProgressBar: true,    
        didOpen: (toast) => {   
          toast.addEventListener('mouseenter', swal.stopTimer)   
          toast.addEventListener('mouseleave', swal.resumeTimer)    
        }         
      }))
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
