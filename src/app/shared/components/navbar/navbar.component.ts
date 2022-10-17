import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  sair() {
    this.firebaseService.sair();
  }
}
