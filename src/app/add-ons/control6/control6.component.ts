import { Component, OnInit } from '@angular/core';

import { Control6 } from './control6.model';
import { Control6Service } from './control6.service';
import { AlertService } from './../../shared_services/alert.service';

@Component({
  selector: 'app-control6',
  templateUrl: './control6.component.html',
  styleUrls: ['./control6.component.css']
})
export class Control6Component implements OnInit {
  controlList: Control6[];

  constructor(
    private controlService: Control6Service,
    private alertService: AlertService) { }

  ngOnInit() {
    this.updateList();
  }

  private updateList(): void {
    this.alertService.clear();
    this.controlService.list().subscribe(
      controls => {
        this.controlList = controls;
      },
      error => {
        this.alertService.error('Ocurrió un error listando los pacientes para control de 6 meses');
        console.log("Error listing Control6 ::: ", error);
      }
    );
  }
}
