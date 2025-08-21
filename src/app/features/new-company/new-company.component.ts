import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, Validators, FormArray,
  ReactiveFormsModule, AbstractControl, ValidationErrors
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CompanyService } from '../../core/services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../shared/components/message-dialog/message-dialog.component';
import { JsonDialogComponent } from '../../shared/components/json-dialog/json-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';



export function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const today = new Date();
  const selected = new Date(value);
  return selected > today ? { futureDate: true } : null;
}

export const MONTH_YEAR_FORMATS = {
  parse: { dateInput: 'MM/YYYY' },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-new-company',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './new-company.component.html',
  styleUrls: ['./new-company.component.scss'],
   providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  ]
})
export class NewCompanyComponent implements OnInit {
  designations = ['Developer', 'Manager', 'System Admin', 'Team Lead', 'PM'];
  skills = ['Java', 'Angular', 'CSS', 'HTML', 'JavaScript', 'UI', 'SQL', 'React', 'PHP', 'GIT', 'AWS', 'Python', 'Django', 'C', 'C++', 'C#', 'Unity', 'R', 'AI', 'NLP', 'Photoshop', 'Node.js'];

  companyForm!: FormGroup;
  outputJson: any = null;
  editingIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialog: MatDialog
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(50)]],
      address: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?[0-9]*$/)]],
      empInfo: this.fb.array([])
    });
    this.addEmployee();
  }

  ngOnInit() {
    this.companyService.selectedCompany$.subscribe(sel => {
      if (sel) {
        this.editingIndex = sel.index;
        this.patchForm(sel.data);
      }
    });
  }

  get empInfo(): FormArray {
    return this.companyForm.get('empInfo') as FormArray;
  }

  addEmployee() {
    const empGroup = this.fb.group({
      empName: ['', [Validators.required, Validators.maxLength(25)]],
      designation: ['Developer'],
      joinDate: ['', [Validators.required, pastDateValidator]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?[0-9]*$/)]],
      skillInfo: this.fb.array([]),
      educationInfo: this.fb.array([])
    });
    this.empInfo.push(empGroup);
  }

  getSkills(empIndex: number): FormArray {
    return this.empInfo.at(empIndex).get('skillInfo') as FormArray;
  }

  addSkill(empIndex: number) {
    this.getSkills(empIndex).push(this.fb.group({
      skillName: [''],
      skillRating: [1, Validators.required]
    }));
  }

  getEducation(empIndex: number): FormArray {
    return this.empInfo.at(empIndex).get('educationInfo') as FormArray;
  }

  addEducation(empIndex: number) {
    this.getEducation(empIndex).push(this.fb.group({
      instituteName: ['', [Validators.required, Validators.maxLength(50)]],
      courseName: ['', [Validators.required, Validators.maxLength(25)]],
      completedYear: ['', Validators.required]
    }));
  }

  chosenMonthHandler(event: Date, empIndex: number, eduIndex: number, datepicker: any) {
  const formatted = this.formatCompletedYear(event);
  this.getEducation(empIndex).at(eduIndex).get('completedYear')?.setValue(formatted);
  datepicker.close();
}



  allowOnlyNumbers(event: KeyboardEvent, control: HTMLInputElement) {
    const char = event.key;
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(char)) return;
    if (/^[0-9]$/.test(char)) return;
    if (char === '+' && control.selectionStart === 0 && !control.value.includes('+')) return;
    event.preventDefault();
  }

  patchForm(data: any) {
    this.companyForm.patchValue({
      companyName: data.companyName,
      address: data.address,
      email: data.email,
      phoneNumber: data.phoneNumber
    });

    this.empInfo.clear();
    (data.empInfo || []).forEach((emp: any) => {
      const empGroup = this.fb.group({
        empName: [emp.empName, [Validators.required, Validators.maxLength(25)]],
        designation: [emp.designation],
        joinDate: [emp.joinDate ? new Date(emp.joinDate) : '', [Validators.required, pastDateValidator]],
        email: [emp.email, [Validators.required, Validators.email, Validators.maxLength(100)]],
        phoneNumber: [emp.phoneNumber, [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?[0-9]*$/)]],
        skillInfo: this.fb.array([]),
        educationInfo: this.fb.array([])
      });

      const skillsArray = empGroup.get('skillInfo') as FormArray;
      (emp.skillInfo || []).forEach((s: any) => {
        skillsArray.push(this.fb.group({
          skillName: [s.skillName],
          skillRating: [s.skillRating]
        }));
      });

      const eduArray = empGroup.get('educationInfo') as FormArray;
      (emp.educationInfo || []).forEach((e: any) => {
        eduArray.push(this.fb.group({
          instituteName: [e.instituteName, [Validators.required, Validators.maxLength(50)]],
          courseName: [e.courseName, [Validators.required, Validators.maxLength(25)]],
          completedYear: [e.completedYear, Validators.required]
        }));
      });

      this.empInfo.push(empGroup);
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const rawValue = this.companyForm.value;
      const formattedJson = this.toExpectedJson(rawValue);

      if (this.editingIndex !== null) {
        this.companyService.updateCompany(this.editingIndex, rawValue);
        this.editingIndex = null;
        this.openDialogs('✅ Company details updated successfully', formattedJson);
      } else {
        this.companyService.addCompany(rawValue);
        this.openDialogs('✅ Company details saved successfully', formattedJson);
      }

      this.companyForm.reset();
      this.empInfo.clear();
      this.addEmployee();
      this.companyService.clearSelectedCompany();
    }
  }

  private openDialogs(message: string, json: any) {
    this.dialog.open(MessageDialogComponent, {
      data: { message }
    }).afterClosed().subscribe(() => {
      this.dialog.open(JsonDialogComponent, {
        data: { json },
        width: '600px'
      });
    });
  }

  private formatCompletedYear(value: any): string {
  if (!value) return '';
  const date = new Date(value);

  if (typeof value === 'string' && /[A-Za-z]{3}\s\d{4}/.test(value)) {
    return value;
  }

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}


  private toExpectedJson(data: any) {
  return {
    companyName: data.companyName,
    address: data.address,
    email: data.email,
    phoneNumber: data.phoneNumber,
    empInfo: (data.empInfo || []).map((emp: any) => ({
      empName: emp.empName,
      designation: emp.designation,
      joinDate: this.formatDDMMYYYY(emp.joinDate),
      email: emp.email,
      phoneNumber: emp.phoneNumber,
      skillInfo: (emp.skillInfo || []).map((s: any) => ({
        skillName: s.skillName,
        skillRating: String(s.skillRating ?? '')
      })),
      educationInfo: (emp.educationInfo || []).map((e: any) => ({
        instituteName: e.instituteName,
        courseName: e.courseName,
        completedYear: this.formatCompletedYear(e.completedYear) 
      }))
    }))
  };
}


  private formatDDMMYYYY(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}
