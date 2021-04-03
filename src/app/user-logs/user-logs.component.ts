import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/common.service';
import { formatDate, DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit {

  constructor(private _commonService: CommonService, private datePipe: DatePipe) { }
  userLogs: any;
  defaultColDef: any;
  rowDataClicked: any;
  columnDefs: any;
  getRowHeight: any;
  ngOnInit() {
    this.getUserLogs();
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      width: 305,
      tooltip: (params) => params.value
    };
    this.columnDefs = [
      {
        headerName: 'User', field: 'first_name', cellRenderer: (params) => {
          return params.value + ' ' + params.data.last_name;
        }
      },
      {
        headerName: 'Browser', field: 'browser', cellRenderer: (params) => {
          return params.data.browser_version ? params.value + ' ' + params.data.browser_version : params.value;
        }
      },
      {
        headerName: 'OS', field: 'os', cellRenderer: (params) => {
          return params.data.os_version ? params.value + ' ' + params.data.os_version : params.value;
        }
      },
      {
        headerName: 'Login Time', field: 'login_time', cellRenderer: (params) => {
          return params.value ? this.datePipe.transform(params.value, 'MMM dd, y h:mm:ss') : '--';
        }
      },
      {
        headerName: 'Logout Time', field: 'logout_time', cellRenderer: (params) => {
          return params.value ? this.datePipe.transform(params.value, 'MMM dd, y h:mm:ss') : '--';
        }
      }

    ];
    this.getRowHeight = function (params) {
      return 40;
    };
  }
  getUserLogs() {
    this._commonService.getApi('getUserLogs', []).then(res => {
      if (res['result'].success) {
        this.userLogs = res['result'].data;
      }
    });
  }
}
