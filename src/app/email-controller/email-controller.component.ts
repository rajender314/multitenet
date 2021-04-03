import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/common.service';
import { CellCustomComponent } from './cell-custom/cell-custom.component';
import { SendMailComponent } from './send-mail/send-mail.component';

@Component({
  selector: 'app-email-controller',
  templateUrl: './email-controller.component.html',
  styleUrls: ['./email-controller.component.scss']
})
export class EmailControllerComponent implements OnInit {
  public rowData: any;
  defaultColDef: any;
  rowDataClicked: any;
  columnDefs: any;
  getRowHeight: any;
  constructor(private _commonService: CommonService) {
    this._commonService.onUpdate().subscribe(ev => {
      if (ev.type == 'email-controllers') {
        this.getEmailControllers();
      }
    })
  }
  ngOnInit() {
    this.getEmailControllers();
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      width: 255,
      tooltip: (params) => params.value
    };
    this.columnDefs = [
      { headerName: 'ID', field: 'id', width: 100 },
      { headerName: 'Email From', field: 'from' },
      { headerName: 'Email To', field: 'to' },
      { headerName: 'Subject', field: 'subject', width: 200 },
      { headerName: 'Sent Date', field: 'sent_date', width: 200 },
      { headerName: 'Status', field: 'status', width: 150 },
      { headerName: 'Show Mail', field: 'action', cellRendererFramework: CellCustomComponent, width: 160 },
      { headerName: 'Send Mail', field: 'action', cellRendererFramework: SendMailComponent, width: 160 },
    ];
    this.getRowHeight = function (params) {
      return 40;
    };
  }
  getEmailControllers() {
    this._commonService.getApi('getEmailControllers', []).then(res => {
      if (res['result'].success) {
        this.rowData = res['result'].data;
      }
    });
  }
}
