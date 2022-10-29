import { Component, OnInit } from '@angular/core';
import { getDoc } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.less'],
})
export class VendasComponent implements OnInit {
  vendas: any[] = [];
  clientes: any;
  usuarios: any;
  produtos: any;

  formInclusaoVenda = this.formBuilder.group({
    cliente: '',
    data: '',
    usuario: '',
    produto: '-1',
    valor: '',
  });

  formEdicaoVenda = this.formBuilder.group({
    cliente: '',
    data: '',
    usuario: '',
    produto: '',
    valor: '',
  });
  vendaSelecionada: any;

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.firebaseService.get('clientes').then((response) => {
      this.clientes = response.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
      });
    });

    this.firebaseService.get('usuarios').then((response) => {
      this.usuarios = response.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
      });
    });

    this.firebaseService.get('produtos').then((response) => {
      this.produtos = response.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
      });
    });

    this.obterVendas();
  }

  obterVendas() {
    this.firebaseService.get('vendas').then((response) => {
      response.docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        let nomeCliente = '';
        let nomeUsuario = '';
        let nomeProduto = '';
        console.log(data['data']);
        getDoc(data['produto'])
          .then((r) => {
            nomeProduto = r.data()['nome'];
          })
          .then(() => {
            getDoc(data['cliente'])
            .then((r) => {
              nomeCliente = r.data()['nome'];
            })
            .then(() => {
              getDoc(data['usuario'])
                .then((r) => {
                  return (nomeUsuario = r.data()['nome']);
                })
                .then(() => {
                  this.vendas.push({
                    id,
                    ...data,
                    cliente: nomeCliente,
                    usuario: nomeUsuario,
                    produto: nomeProduto,
                  });
                });
            });
          });
      });
    });
  }

  sair() {
    this.firebaseService.sair();
  }

  adicionarProduto() {
    this.firebaseService.sair();
  }

  onSubmitCreate(): void {
    this.firebaseService
      .post(
        { id: this.vendaSelecionada.id, ...this.formInclusaoVenda.value },
        'vendas'
      )
      .then(() => {
        (<any>$('#cadastrarVendaModal')).modal('hide');

        Swal.fire({
          icon: 'success',
          title: 'Venda cadastrada com sucesso!',
        });
        this.formInclusaoVenda.reset();
        this.obterVendas();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar uma venda!',
        });
      });
  }

  onSubmitEdit(): void {
    this.firebaseService
      .update(this.formEdicaoVenda.value, this.vendaSelecionada.id, 'vendas')
      .then(() => {
        (<any>$('#editarVendaModal')).modal('hide');

        Swal.fire({
          icon: 'success',
          title: 'Venda editada com sucesso!',
        });
        this.formEdicaoVenda.reset();
        this.obterVendas();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao editar venda!',
        });
      });
  }

  selecionarVenda(venda: any) {
    this.vendaSelecionada = venda;
    const clone = (({ id, ...o }) => o)(venda);
    this.formEdicaoVenda.setValue(clone);
  }

  excluirVenda() {
    this.firebaseService
      .delete(this.vendaSelecionada.id, 'vendas')
      .then(() => {
        (<any>$('#excluirVendaModal')).modal('hide');

        Swal.fire({
          icon: 'success',
          title: 'Venda excluída com sucesso!',
        });
        this.obterVendas();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao excluir venda!',
        });
      });
  }
}
