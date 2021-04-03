import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/common/common.service';
import { DatePipe } from '@angular/common';
import { StatusChangeComponent } from './status-change/status-change.component';
import { CellClickedEvent } from 'ag-grid-community';
import { ConfirmdialogComponent } from '@app/dialogs/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-system-errors',
  templateUrl: './system-errors.component.html',
  styleUrls: ['./system-errors.component.scss']
})
export class SystemErrorsComponent implements OnInit {
  systemErrors: any;
  params = {

  }
  defaultColDef: any;
  columnDefs: any;
  getRowHeight: any;
  constructor(private _commonService: CommonService, private datePipe: DatePipe, private _dialog: MatDialog) {

  }

  ngOnInit() {
    this.getSystemErrors();
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      tooltip: (params) => params.value
    };
    this.columnDefs = [
      { headerName: 'ID', field: 'id', width: 100 },
      {
        headerName: 'User', field: 'first_name', cellRenderer: (params) => {
          return params.value + ' ' + params.data.last_name;
        }, width: 150
      },
      { headerName: 'Message', field: 'message', width: 850 },
      {
        headerName: 'Date Added', field: 'date_added', cellRenderer: (params) => {
          return params.value ? this.datePipe.transform(params.value, 'MMM dd, y h:mm:ss') : '--';
        }, width: 200
      },
      {
        headerName: 'Status', field: 'status', cellRendererFramework: StatusChangeComponent, width: 150
      }
    ];
    this.getRowHeight = function (params) {
      return 40;
    };
  }
  getSystemErrors() {
    this._commonService.getApi('getSystemErrors', this.params).then(res => {
      if (res['result'].success) {
        this.systemErrors = res['result'].data;
      }
    })
  }
  onCellClicked($event: CellClickedEvent) {
    if ($event.column['userProvidedColDef'].field == 'message') {
      this._dialog.open(ConfirmdialogComponent, {
        panelClass: 'my-centered-dialog',
        height: '180px',
        width: '800px',
        data: {
          title: 'Message', 
          params: {},
          action: 'Message',
          url: 'Message',
          content: $event.value
        }
      })
        .afterClosed()
        .subscribe(res => {
        })
    }
  }
}
