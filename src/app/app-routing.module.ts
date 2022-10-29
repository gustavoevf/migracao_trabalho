import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VendasComponent } from './vendas/vendas.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'produtos',
    component: ProdutosComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'vendas',
    component: VendasComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
