import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/common.service';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styleUrls: ['./status-change.component.scss']
})
export class StatusChangeComponent implements OnInit {
  params: any;
  selected: any;
  statuses = [
    { value: 1, viewValue: 'True' },
    { value: 0, viewValue: 'False' },
  ];
  constructor(private _commonService: CommonService, private snackbar: MatSnackBar) { }

  ngOnInit() {
  }
  changeStatus(value) {
    if ((value == 1 && this.params.data.status == true) || (value == 0 && this.params.data.status == 'false')) {
      return;
    }
    this._commonService.saveApi('updateSystemErrorStatus', { id: this.params.data.id, status: value }).then(res => {
      if (res['result'].success) {
        this.params.data.status = this.params.data.status ? false : true;
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { status: 'success', msg: 'Status updated successfully' },
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
  agInit(params) {
    this.params = params;
    this.selected = this.params.data.status ? 1 : 0;
  }
}
