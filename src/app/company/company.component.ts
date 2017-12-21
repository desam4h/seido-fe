import { Component, OnInit } from '@angular/core';

import { Company } from './company.model';
import { CompanyService } from './company.service';

@Component({
  selector: 'company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyList: Company[];
  selectedCompany: Company;
  private editMode: boolean;

  constructor(
    private service: CompanyService) { }

  ngOnInit() {
    this.updateList();
  }

  onSelectDetail(company:Company) : void {
    this.selectedCompany = {...company};
    this.editMode = true;
  }

  onSelectNew() : void {
    this.selectedCompany = Company.empty();
  }

  onSave() : void {
    if (this.editMode) {
      this.service.update(this.selectedCompany).subscribe(
        company => {
          this.selectedCompany = null;
          this.updateList();
        },
        error => console.log("Error updatingCompany ", error)
      );
    } else {
      this.service.save(this.selectedCompany).subscribe(
        company => {
          this.selectedCompany = company;
          this.companyList.push(company);
        },
        error => console.log("Error savingCompany ", error)
      );
    }
  }

  onDelete(company:Company) :void {
    if(confirm("Está seguro de eliminar la empresa?")) {
      this.service.delete(company).subscribe(
        resp => {
          if(resp.ok) {
            this.updateList();
          }
        },
        error => alert("No es posible eliminar la empresa.")
      );
    }
  }

  private updateList() : void {
    this.service.list().subscribe(
      companies => {
        this.companyList = companies;
      },
      error => {
        console.log("Error listingCompanies ::: ", error);
      }
    );
  }
}
