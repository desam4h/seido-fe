import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared_components/header/header.component';
import { FooterComponent } from './shared_components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './shared_components/alert/alert.component';
import { CompanyComponent } from './company/company.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { PatientComponent } from './patient/patient.component';
import { SurveyTemplateComponent } from './survey-template/survey-template.component';

import { AlertService } from './shared_services/alert.service';
import { AuthenticationService } from './shared_services/authentication.service';
import { UserService } from './shared_services/user.service';
import { CompanyService } from './company/company.service';
import { SpecialtyService } from './specialty/specialty.service';
import { SurveyTemplateService } from './survey-template/survey-template.service';
import { AuthGuard } from './shared_services/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    CompanyComponent,
    SpecialtyComponent,
    PatientComponent,
    SurveyTemplateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    FormsModule
  ],
  providers: [
    AlertService,
    AuthenticationService,
    UserService,
    CompanyService,
    SpecialtyService,
    SurveyTemplateService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
