import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { SurveyTemplate } from './survey-template.model';

@Injectable()
export class SurveyTemplateService {

  constructor(private http: HttpClient) { }

  list(specialtyId: number): Observable<SurveyTemplate []> {
    let url: string = this.buildApiUrl(specialtyId);
    return this.http.get(url, this.jwt()).map(resp => <SurveyTemplate[]>resp);
  }

  save(specialtyId: number, surveyTemplate: SurveyTemplate): Observable<SurveyTemplate> {
    let url: string = this.buildApiUrl(specialtyId);
    return this.http.post(url, surveyTemplate, this.jwt()).map(resp => <SurveyTemplate>resp);
  }
  
  update(specialtyId: number, surveyTemplate: SurveyTemplate): Observable<SurveyTemplate> {
    let url: string = this.buildApiUrl(specialtyId);
    return this.http.put(url, surveyTemplate, this.jwt()).map(resp => <SurveyTemplate>resp);
  }

  delete(specialtyId: number, surveyTemplate: SurveyTemplate): Observable<any> {
    let url: string = this.buildApiUrl(specialtyId, surveyTemplate.id);
    return this.http.delete(url, this.jwt());
  }

  getStatistics(template: SurveyTemplate): Observable<any> {
    let url: string = this.buildApiUrl(template.specialty.id, template.id);
    return this.http.get(`${url}/statistics`, {responseType: 'blob'});
    //.map(resp => resp;
  }

  uploadInfo(template: SurveyTemplate, info: string): Observable<any>{
    let url: string = this.buildApiUrl(template.specialty.id, template.id);
    return this.http.post(`${url}/upload`, info).map(resp => resp);
  }
  
  // private helper methods

  private buildApiUrl(specialtyId:number, templateId?:number) : string {
    return `${environment.apiBaseUrl}/specialty/${specialtyId}/surveyTemplate/${templateId || ''}`;
  }

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token });
        return { headers: headers };
    }
  }
}
