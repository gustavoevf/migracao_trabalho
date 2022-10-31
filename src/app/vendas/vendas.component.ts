import { Component, OnInit } from '@angular/core';
import {
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getFirestore,
} from '@angular/fire/firestore';
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
  movVendasCreate: any[] = [];
  clientes: any;
  usuarios: any;
  produtos: any;
  movVendas: any[] = [];
  movVendasEdit: any[] = [];
  formInclusaoVenda = this.formBuilder.group({
    idCliente: '-1',
    data: '',
    idUsuario: '-1',
    valor: '',
    descricao: ''
  });

  formEdicaoVenda = this.formBuilder.group({
    idCliente: '',
    data: '',
    idUsuario: '',
    valor: '',
    descricao: ''
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
        this.firebaseService.getById('clientes', data['idCliente'])
          .then((r) => {
            nomeCliente = r['nome'];
          })
          .then(() => {
            this.firebaseService.getById('usuarios', data['idUsuario'])
              .then((r) => {
                nomeUsuario = r['nome'];
              })
              .then(() => {
                this.firebaseService.get('mov_vendas').then((res) => {
                  let nomeProdutos = [];
                  res.docs.forEach((docMov) => {
                    if(docMov.data()['idVenda'] == doc.id){
                      this.movVendas.push(docMov.data());
                      this.produtos.map((e) => {
                        if(e['id'] == docMov.data()['idProduto']){
                          nomeProdutos.push(e['nome']);
                        }
                      })
                    }
                  })
                  this.vendas.push({
                    id,
                    ...data,
                    cliente: nomeCliente,
                    usuario: nomeUsuario,
                    produto: nomeProdutos.toString(),
                  });
                })
              });
          });
      });
    });
  }

  sair() {
    this.firebaseService.sair();
  }

  adicionarProdutoCreate() {
    const produtoId = (document.getElementById('idProduto') as HTMLSelectElement).value;
    const quantidade = Number(
      (document.getElementById('qtdVenda') as HTMLInputElement).value
    );
    if (produtoId != '-1' || quantidade || quantidade > 0) {
      const produtoSelecionado = document.getElementById(
        'idProduto'
      ) as HTMLSelectElement;
      const produtoNome =
        produtoSelecionado.options[produtoSelecionado.selectedIndex].text;
      this.movVendasCreate.push({
        idProduto: produtoId,
        nomeProduto: produtoNome,
        quantidade: quantidade,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Digite um produto e quantidade válidos!',
      });
    }
  }

  removerProdutoCreate(i: number) {
    this.movVendasCreate.splice(i, 1);
  }

  adicionarProdutoEdit() {
    const produtoId = (document.getElementById('idProdutoEdit') as HTMLInputElement).value;
    const quantidade = Number(
      (document.getElementById('qtdVendaEdit') as HTMLInputElement).value
    );
    if (produtoId != '-1' || quantidade || quantidade > 0) {
      const produtoSelecionado = document.getElementById(
        'idProdutoEdit'
      ) as HTMLSelectElement;
      const produtoNome =
        produtoSelecionado.options[produtoSelecionado.selectedIndex].text;
      this.movVendasEdit.push({
        idProduto: produtoId,
        nomeProduto: produtoNome,
        quantidade: quantidade,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Digite um produto e quantidade válidos!',
      });
    }
  }

  removerProdutoEdit(i: number) {
    this.movVendasEdit.splice(i, 1);
  }

  onSubmitCreate(): void {
    if (this.movVendasCreate.length > 0) {
      this.firebaseService
        .post(this.formInclusaoVenda.value, 'vendas')
        .then((resVenda) => {
          this.movVendasCreate.forEach((e) => {
            this.firebaseService
              .post(
                {
                  idProduto: e.idProduto,
                  quantidadeProduto: e.quantidade,
                  idVenda: resVenda.id,
                },
                'mov_vendas'
              )
              .then(() => {})
              .catch((error) => {
                console.log(error)
                Swal.fire({
                  icon: 'error',
                  title: 'Erro ao incluir produtos!',
                });
              });
          });

          (<any>$('#cadastrarVendaModal')).modal('hide');

          Swal.fire({
            icon: 'success',
            title: 'Venda cadastrada com sucesso!',
          });
          this.formInclusaoVenda.reset();
          this.obterVendas();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar uma venda!',
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Adicione produtos à venda!',
      });
    }
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
    console.log(venda['id']);
    console.log(this.movVendas);
    this.movVendas.forEach(e => {
      if(e['idVenda'] == venda['id']){
        this.produtos.forEach(p => {
          if(p['id'] == e['idProduto']){
            this.movVendasEdit.push({...e, nomeProduto: p['nome']});
          }
        })
      }
    })
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
