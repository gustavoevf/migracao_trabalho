import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.less']
})
export class ProdutosComponent implements OnInit {
  produtos: any;
  categorias: any;

  formInclusaoProduto = this.formBuilder.group({
    nome: '',
    categoria: '',
    preco: '',
    descricao: '',
    tags: '',
    quantidade: ''
  });
  formEdicaoProduto = this.formBuilder.group({
    nome: '',
    categoria: '',
    preco: '',
    descricao: '',
    tags: '',
    quantidade: ''
  });
  produtoSelecionado: any;

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.firebaseService.get('cat_produtos').then((response) => {
      this.categorias = response.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
      });
    });

    this.obterProdutos();
  }

  obterProdutos() {
    this.firebaseService.get('produtos').then((response) => {
      this.produtos = response.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
      });
    });
  }

  public formatarMoeda(i: any){
    var v = i.value.replace(/\D/g,'');
    v = (v/100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    i.value = v;
  }

  onSubmitCreate(): void {
    this.firebaseService.post(this.formInclusaoProduto.value, 'produtos').then(() => {
      (<any>$('#cadastrarProdutoModal')).modal('hide');

      Swal.fire({
        icon: 'success',
        title: 'Produto cadastrado com sucesso!'
      });
      this.formInclusaoProduto.reset();
      this.obterProdutos();
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar produto!'
      });
    })
  }

  onSubmitEdit(): void {
    this.firebaseService.update(this.formEdicaoProduto.value, 'produtos').then(() => {

      (<any>$('#editarProdutoModal')).modal('hide');

      Swal.fire({
        icon: 'success',
        title: 'Produto editado com sucesso!'
      });
      this.formEdicaoProduto.reset();
      this.obterProdutos();
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao editar produto!'
      });
    })
  }

  selecionarProduto(produto: any) {
    this.produtoSelecionado = produto;
  }

  excluirProduto() {
    this.firebaseService.delete(this.produtoSelecionado.id, 'produtos').then(() => {
      (<any>$('#excluirProdutoModal')).modal('hide');

      Swal.fire({
        icon: 'success',
        title: 'Produto excluído com sucesso!'
      });
      this.obterProdutos();

    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir produto!'
      });
    })
  }


}
