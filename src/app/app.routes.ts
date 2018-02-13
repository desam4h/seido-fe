import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { SurveyTemplateComponent } from './survey-template/survey-template.component';
import { PatientComponent } from './patient/patient.component';
import { EventComponent } from './event/event.component';
import { SurveyComponent } from './survey/survey.component';
import { AuthGuard } from './shared_services/auth.guard';
import { UserComponent } from './user/user.component';
import { Control6Component } from './add-ons/control6/control6.component';

export const ROUTES: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'company', component: CompanyComponent, canActivate: [AuthGuard] },
    { path: 'specialty', component: SpecialtyComponent, canActivate: [AuthGuard] },
    { path: 'specialty/:specialtyId/survey-template', component: SurveyTemplateComponent, canActivate: [AuthGuard] },
    { path: 'patient', component: PatientComponent, canActivate: [AuthGuard] },
    { path: 'patient/:patientId/event', component: EventComponent, canActivate:[AuthGuard]},
    { path: 'patient/:patientId/survey/:surveyId', component: SurveyComponent, canActivate:[AuthGuard]},
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'control6', component: Control6Component, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];