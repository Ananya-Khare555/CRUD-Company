import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CompanyService } from '../../core/services/company.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent {
  displayedColumns: string[] = ['companyName', 'email', 'phoneNumber', 'createdAt', 'action'];
  companies: any[] = [];
  dialog = inject(MatDialog);
  companyService = inject(CompanyService);
  router = inject(Router);

  constructor() {
    this.companyService.companies$.subscribe(list => {
      this.companies = list;
    });
  }

  editCompany(index: number) {
    this.companyService.setSelectedCompany(this.companies[index], index);
    this.router.navigate(['/new-company']);
  }

  confirmDelete(index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: this.companies[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.companyService.deleteCompany(index);
      }
    });
  }
}
