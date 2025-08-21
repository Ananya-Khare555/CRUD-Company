import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>
      Output JSON
      <button mat-icon-button class="close-btn" (click)="close()">
        ✖
      </button>
    </h2>

    <mat-dialog-content>
      <pre>{{ data.json | json }}</pre>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button color="primary" (click)="download()">⬇ Download</button>
      <button mat-raised-button color="accent" (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
    }
    .close-btn {
      font-size: 16px;
      line-height: 1;
    }
    pre {
      max-height: 400px;
      overflow: auto;
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
    }
  `]
})
export class JsonDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { json: any },
    private dialogRef: MatDialogRef<JsonDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

  download() {
    const blob = new Blob([JSON.stringify(this.data.json, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
