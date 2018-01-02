import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { Patient } from '../patient/patient.model';
import { Specialty } from '../specialty/specialty.model';
import { Survey } from '../survey/survey.model';
import { Event } from './event.model';

import { PatientService } from '../patient/patient.service';
import { EventService } from './event.service';
import { SurveyService } from '../survey/survey.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  patient: Patient;
  filteredEvents: Event[];
  newEvent: Event;
  selectedSpecialty: Specialty;
  private surveys: Survey[];
  specialties: Specialty[];
  private filteredBasicSurveys: Survey[];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private eventService: EventService,
    private surveyService: SurveyService) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        let patientId = params['patientId'];
        this.buildPatientInfo(patientId);
        this.buildSurveysInfo(patientId);
      }
    );
  }

  private buildPatientInfo(patientId: number): void {
    this.patientService.find(patientId).subscribe(
      patient => {
        this.patient = patient;
      },
      error => {
        console.log("Error finding patient ::: ", error);
      }
    );
  }

  private buildSurveysInfo(patientId: number): void {
    this.surveyService.list(patientId).subscribe(
      surveys => {
        this.surveys = surveys;
        this.buildSpecialtyInfo(surveys);
        this.filteredBasicSurveys = this.buildFilteredBasicSurveys(surveys);
        this.filteredEvents = this.buildFilteredEvents(surveys);
      },
      error => {
        console.log("Error listing surveys ::: ", error);
      }
    );
  }

  private buildSpecialtyInfo(surveys: Survey[]) {
    this.specialties = this.buildSpecialtiesFilter(surveys);

    if (this.specialties.length > 0 && !this.selectedSpecialty) {
      this.selectedSpecialty = this.specialties[0];
    }
  }

  private buildSpecialtiesFilter(surveys: Survey[]): Specialty[] {
    let uniqueSpecialties = new Map<number, Specialty>();

    surveys
      .map(survey => survey.template.specialty)
      .forEach(item => uniqueSpecialties.set(item.id, item));

    return Array.from(uniqueSpecialties.values());
  }

  private buildFilteredBasicSurveys(surveys: Survey[]): Survey[] {
    return surveys.filter(survey =>
      !survey.event
      && survey.template.type === "BASIC_INFO"
      && survey.template.specialty.id === this.selectedSpecialty.id
    );
  }

  private buildFilteredEvents(surveys: Survey[]): Event[] {
    let uniqueEvents = new Map<number, Event>();

    surveys
      .filter(survey =>
        survey.event
        && survey.template.specialty.id === this.selectedSpecialty.id
        && survey.template.type === "SPECIALTY_INFO")
      .map(survey => {
        let event: Event = survey.event;
        event.surveys = [survey];
        return event;
      })
      .forEach(event => {
        if (uniqueEvents.has(event.id)) {
          uniqueEvents.get(event.id).surveys.push(...event.surveys);
        } else {
          uniqueEvents.set(event.id, event);
        }
      });

    return Array.from(uniqueEvents.values());
  }

  selectSpecialtyFilter(selectedSpecialty: Specialty) {
    this.selectedSpecialty = selectedSpecialty;
    this.filteredBasicSurveys = this.buildFilteredBasicSurveys(this.surveys);
    this.filteredEvents = this.buildFilteredEvents(this.surveys);
  }

  onSelectNewEvent(): void {
    this.newEvent = Event.empty();
  }

  onSaveEvent() {
    this.newEvent.specialty = this.selectedSpecialty;

    this.eventService.save(this.patient.id, this.newEvent).subscribe(
      event => {
        this.buildSurveysInfo(this.patient.id);
      },
      error => {
        console.log("Error saving event ::: ", error);
      }
    );
  }

  onDeleteEvent(event: Event) {
    if (confirm("Está seguro de eliminar el evento?")) {
      this.eventService.delete(this.patient.id, event).subscribe(
        resp => {
            this.buildSurveysInfo(this.patient.id);
        },
        error => {
          console.log("Error deleting Event ::: ", error);
        }
      );
    }
  }

  getSurveyStateStyle(state: string) {
    switch (state) {
      case 'NOT_STARTED':
        return 'survey-not-started';
      case 'STARTED':
        return 'survey-started';
      case 'FINISHED':
        return 'survey-solved';
      default:
        return 'survey-invalid-state';
    }
  }

  hasBasicSurveysFinished(): boolean {
    if (this.filteredBasicSurveys) {
      let pendingSurvey: Survey = this.filteredBasicSurveys.find(survey => survey.state != "FINISHED");

       if(!pendingSurvey) {
         return true;
       }
    }

    return false;
  }

}
