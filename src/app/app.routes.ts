import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { PatientComponent } from './patient/patient.component';

export const ROUTES: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'company', component: CompanyComponent},
    { path: 'specialty', component: SpecialtyComponent },
    //{ path: 'specialty/:specialtyId/survey-template', component: SurveyTemplateComponent, canActivate:[AuthGuard]},
    { path: 'patient', component: PatientComponent },
    //{ path: 'patient/:patientId/event', component: HealthEventComponent, canActivate:[AuthGuard]},
    //{ path: 'patient/:patientId/survey/:surveyId', component: SurveyComponent, canActivate:[AuthGuard]},
    //{ path: 'callback', component: CallbackComponent},
    //{ path: 'error', component: ErrorPageComponent},
    //{ path: '**', redirectTo: '' }
];