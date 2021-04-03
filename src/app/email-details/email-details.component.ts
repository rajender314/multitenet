import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/common/common.service';
import { CellCustomComponent } from '@app/email-controller/cell-custom/cell-custom.component';

@Component({
  selector: 'app-email-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.scss']
})
export class EmailDetailsComponent implements OnInit {
  public rowData: any;
  defaultColDef: any;
  rowDataClicked: any;
  columnDefs: any;
  getRowHeight: any;
  constructor(private _commonService: CommonService) { }
  ngOnInit() {
    this.getEmailDetails();
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      width: 330,
      tooltip: (params) => params.value
    };
    this.columnDefs = [
      { headerName: 'ID', field: 'id', width: 100 },
      { headerName: 'Email From', field: 'from' },
      { headerName: 'Email To', field: 'to' },
      { headerName: 'Subject', field: 'subject' },
      { headerName: 'Sent Date', field: 'date_added', width: 300 },
      { headerName: 'Show Mail', field: 'action', cellRendererFramework: CellCustomComponent, width: 150 },
    ];
    this.getRowHeight = function (params) {
      return 40;
    };
  }
  getEmailDetails() {
    this._commonService.getApi('getEmailDetails', []).then(res => {
      if (res['result'].success) {
        this.rowData = res['result'].data;
      }
    });
  }
}
