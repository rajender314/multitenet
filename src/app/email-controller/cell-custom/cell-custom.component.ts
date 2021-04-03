import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShowMessageComponent } from '../show-message/show-message.component';

@Component({
  selector: 'app-cell-custom',
  templateUrl: './cell-custom.component.html',
  styleUrls: ['./cell-custom.component.scss']
})
export class CellCustomComponent implements OnInit {
  data: any;
  params: any;
  constructor(private http: HttpClient, private router: Router, private _dialog: MatDialog) { }

  ngOnInit() {
  }
  agInit(params) {
    this.params = params;
  }
  showMail() {
    let rowData = this.params;
    this._dialog.open(ShowMessageComponent, {
      panelClass: 'my-centered-dialog',
      height: '520px',
      width: '600px',
      data: {
        title: 'Show Message',
        params: { message: rowData.data.message },
      }
    })
      .afterClosed()
      .subscribe(res => {
      })
  }
}
