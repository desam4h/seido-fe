import { Component, OnInit } from '@angular/core';

import { Specialty } from './specialty.model';
import { SpecialtyService } from './specialty.service';
import { AlertService } from '../shared_services/alert.service';

//import { Observable, Subscription } from 'rxjs/Rx';
 
@Component({
  selector: 'specialty',
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.css']
})

export class SpecialtyComponent {
  specialtyList: Specialty[];
  selectedSpecialty: Specialty;
  private editMode: boolean;

  constructor(
    private service: SpecialtyService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.updateList();
  }

  onSelectDetail(specialty: Specialty): void {
    this.selectedSpecialty = specialty;
    this.editMode = true;
  }

  onSelectNew(): void {
    this.selectedSpecialty = Specialty.empty();
    this.editMode = false;
  }
  
  onSelectDelete(specialty: Specialty): void {
    this.selectedSpecialty = specialty;
    this.editMode = false;
  }

  onSave(): void {
    if(this.selectedSpecialty.name != null && this.selectedSpecialty.name != ''){

      if (this.editMode) {
        
        this.service.update(this.selectedSpecialty).subscribe(
          specialty => {
            this.selectedSpecialty = null;
            this.updateList();
          },
          error => {
            this.alertService.error('Ocurrió un error actualizando la especialidad');
            console.log("Error updating Specialty ::: ", error);
          }
        );
      } else {

        this.service.save(this.selectedSpecialty).subscribe(
          specialty => {
            this.selectedSpecialty = null;
            this.updateList();
          },
          error => {
            this.alertService.error('Ocurrió un error creando la especialidad');
            console.log("Error saving Specialty ::: ", error);
          }
        );
      }
    }else{
      this.alertService.error('El nombre es obligatorio');
    }
  }

  onDelete(specialty: Specialty): void {
    this.service.delete(this.selectedSpecialty).subscribe(
      resp => {
        this.selectedSpecialty = null;
        this.updateList();
        this.alertService.success('Especialidad eliminada correctamente');
      },
      error => {
        if(error.status == 412) {
          this.alertService.warning('La especialidad tiene dependencias que deben ser eliminadas primero');
        }else {
          this.alertService.error('Ocurrió un error eliminando la especialidad');
          console.log("Error deleting Specialty ::: ", error);
        }
      }
    );
  }

  private updateList(): void {
    this.alertService.clear();
    this.service.list().subscribe(
      specialties => {
        this.specialtyList = specialties;
      },
      error => {
        this.alertService.error('Ocurrió un error listando las especialidades');
        console.log("Error listing Specialties ::: ", error);
      }
    );
  }

}
