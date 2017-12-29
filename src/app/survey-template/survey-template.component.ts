import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { SurveyTemplate } from './survey-template.model';
import { Specialty } from '../specialty/specialty.model';
import { SurveyTemplateService } from './survey-template.service';
import { AlertService } from '../shared_services/alert.service';
import { SpecialtyService } from '../specialty/specialty.service';

@Component({
  selector: 'survey-template',
  templateUrl: './survey-template.component.html',
  styleUrls: ['./survey-template.component.css']
})
export class SurveyTemplateComponent {
  surveyList: SurveyTemplate[];
  selectedSurvey: SurveyTemplate;
  private editMode: boolean;
  private specialtyId: number;

  @ViewChild('fileUploadField') fileUploadField: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyTemplateService,
    private specialtyService: SpecialtyService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.specialtyId = params['specialtyId'];
        this.updateList(this.specialtyId);
      }
    );
  }
  
  onSelectDetail(survey: SurveyTemplate): void {
    this.selectedSurvey = survey;
    this.editMode = true;
  }

  onSelectNew(): void {
    this.selectedSurvey = SurveyTemplate.empty();
    this.editMode = false;
  }

  onSelectUpload(survey: SurveyTemplate): void {
    this.selectedSurvey = survey;
    this.editMode = true;
  }

  onSelectDelete(survey: SurveyTemplate): void {
    this.selectedSurvey = survey;
    this.editMode = false;
  }

  onSave(): void {
    if(this.selectedSurvey.name != null && this.selectedSurvey.name != '' 
      && this.selectedSurvey.jsSurvey != null && this.selectedSurvey.jsSurvey != ''){

      if (this.editMode) {

        this.surveyService.update(this.specialtyId, this.selectedSurvey).subscribe(
          survey => {
            this.selectedSurvey = null;
            this.updateList(this.specialtyId);
          },
          error => {
            this.alertService.error('Ocurrió un error actualizando la plantilla');
            console.log("Error updating Survey Template ::: ", error);
          }
        );
      } else {

        this.surveyService.save(this.specialtyId, this.selectedSurvey).subscribe(
          survey => {
            this.selectedSurvey = null;
            this.updateList(this.specialtyId);
          },
          error => {
            this.alertService.error('Ocurrió un error creando la plantilla');
            console.log("Error saving Survey Template ::: ", error);
          }
        );
      }
    }else{
      this.alertService.error('Todos los campos son obligatorios');
    }
  }
  
  onDelete(survey: SurveyTemplate): void {
    this.surveyService.delete(this.specialtyId, this.selectedSurvey).subscribe(
      resp => {
        this.selectedSurvey = null;
        this.updateList(this.specialtyId);
        this.alertService.success('Plantilla eliminada correctamente');
      },
      error => {
        this.alertService.error('Ocurrió un error eliminando la plantilla');
        console.log("Error deleting Survey Template ::: ", error);
      }
    );
  }

  downloadStatistics(survey: SurveyTemplate) {
    var options = {
      showLabels: true,
      useBom: false
    };

    this.surveyService.getStatistics(survey).subscribe(
      resp => {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(resp.blob());
        a.download = "info.csv";
        a.click();
      },
      error => {
        this.alertService.error('Ocurrió un error generando el archivo de la plantilla');
        console.log("Error in downloadStatistics of Survey Template ::: ", error);
      }
    );
  }

  uploadFileCsv() {
    console.log("::: Sending request to API");

    let fileBrowser = this.fileUploadField.nativeElement;
    let reader = new FileReader();

    if (fileBrowser.files && fileBrowser.files[0]) {
      let csvFile = fileBrowser.files[0];
      reader.readAsText(csvFile);
      reader.onload = () => {
        this.surveyService.uploadInfo(this.selectedSurvey, reader.result).subscribe(
          resp => {
            this.alertService.success('Se han cargado XX líneas exitosamente');
            console.log('::::: resp num lineas: ' + JSON.stringify(resp));
            // TODO: alert(`Se han cargado ${resp.uploadedRows} exitosamente`)
          },
          error => {
            this.alertService.error('Ocurrió un error cargando el archivo de la plantilla');
            console.log("Error in uploadFileCsv of Survey Template ::: ", error);
          }
        );
      };
    }
  }
  
  private updateList(specialtyId: number): void {
    this.alertService.clear();
    this.surveyService.list(specialtyId).subscribe(
      surveys => {
        this.surveyList = surveys
      },
      error => {
        this.alertService.error('Ocurrió un error listando las plantillas');
        console.log("Error listing SurveyTemplates ::: ", error);
      }
    );
  }

}