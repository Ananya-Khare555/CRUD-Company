import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'companies';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private companiesSubject = new BehaviorSubject<any[]>(this.loadCompanies());
  companies$ = this.companiesSubject.asObservable();

  private selectedCompanySubject = new BehaviorSubject<{ data: any, index: number } | null>(null);
  selectedCompany$ = this.selectedCompanySubject.asObservable();

  get companies(): any[] {
    return this.companiesSubject.value;
  }

  private loadCompanies(): any[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      empInfo: c.empInfo.map((emp: any) => ({
        ...emp,
        joinDate: emp.joinDate ? new Date(emp.joinDate) : null
      }))
    }));
  }
  return [];
}



  private saveCompanies(companies: any[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }

  addCompany(company: any) {
    const updated = [...this.companies, { ...company, createdAt: new Date() }];
    this.companiesSubject.next(updated);
    this.saveCompanies(updated);
  }

  deleteCompany(index: number) {
    const updated = [...this.companies];
    updated.splice(index, 1);
    this.companiesSubject.next(updated);
    this.saveCompanies(updated);
  }

  updateCompany(index: number, updatedCompany: any) {
    const updated = [...this.companies];
    updated[index] = { ...updatedCompany, createdAt: updated[index].createdAt };
    this.companiesSubject.next(updated);
    this.saveCompanies(updated);
  }

  setSelectedCompany(data: any, index: number) {
    this.selectedCompanySubject.next({ data, index });
  }

  clearSelectedCompany() {
    this.selectedCompanySubject.next(null);
  }
}
