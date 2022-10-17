import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    senha: new FormControl(''),
  });

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  entrar() {
    this.firebaseService.loginUsuarioSenha(this.loginForm.controls['email'].value, this.loginForm.controls['senha'].value).then(() => {
      this.router.navigate(['usuarios']);
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao realizar login!'
      });
    });
  }

}
