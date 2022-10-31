import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.less']
})
export class UsuariosComponent implements OnInit {
  usuarios: any;
  formInclusaoUsuario = this.formBuilder.group({
    nome: '',
    email: '',
    celular: '',
    senha: '',
  });

  formEdicaoUsuario = this.formBuilder.group({
    nome: '',
    email: '',
    celular: '',
    senha: '',
  });
  usuarioSelecionado: any;

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.obterUsuarios();
  }

  obterUsuarios() {
    this.firebaseService.get('usuarios').then((response) => {
      this.usuarios = response.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
      });
    });
  }

  sair() {
    this.firebaseService.sair();
  }

  onSubmitCreate(): void {
    this.firebaseService.post(this.formInclusaoUsuario.value, 'usuarios').then(() => {

      (<any>$('#cadastrarUsuarioModal')).modal('hide');

      Swal.fire({
        icon: 'success',
        title: 'Usuário cadastrado com sucesso!'
      });
      this.formInclusaoUsuario.reset();
      this.obterUsuarios();
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar usuário!'
      });
    })
  }

  onSubmitEdit(): void {
    this.firebaseService.update(this.formEdicaoUsuario.value, this.usuarioSelecionado.id, 'usuarios').then(() => {

      (<any>$('#editarUsuarioModal')).modal('hide');

      Swal.fire({
        icon: 'success',
        title: 'Usuário editado com sucesso!'
      });
      this.formEdicaoUsuario.reset();
      this.obterUsuarios();
    }).catch((error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao editar usuário!'
      });
    })
  }

  selecionarUsuario(usuario: any) {
    this.usuarioSelecionado = usuario;
    const clone = (({ id, ...o }) => o)(usuario);
    this.formEdicaoUsuario.setValue(clone);
  }

  excluirUsuario() {
    this.firebaseService.delete(this.usuarioSelecionado.id, 'usuarios').then(() => {
      (<any>$('#excluirUsuarioModal')).modal('hide');

      Swal.fire({
        icon: 'success',
        title: 'Usuário excluído com sucesso!'
      });
      this.obterUsuarios();

    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir usuário!'
      });
    })
  }

}
