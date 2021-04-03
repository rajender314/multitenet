import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/common.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private _commonService: CommonService, private snackbar: MatSnackBar) { }
  public radioValue: Number;
  public radioOldValue: Number;
  isChanged: any = false;
  params: any = {

  }
  ngOnInit() {
    this.saveSettingsInfo(1);
  }
  saveSettings() {
    this.saveSettingsInfo(2);
  }
  checkedRadioButton(val) {
    this.radioValue = val;
    this.isChanged = false;
    if (this.radioValue != this.radioOldValue) {
      this.isChanged = true;
    }
    
  }
  resetForm() {
    this.saveSettingsInfo(1);
  }
  saveSettingsInfo(flag) {

    if (flag == 2) {
      if (this.radioOldValue == this.radioValue) {
        return;
      }
      this.params.flag = this.radioValue;
    }
    this._commonService.saveApi('save_settings', this.params).then(res => {
      if (res['result'].success) {
        this.isChanged = false;
        this.radioValue = res['result'].data;
        this.radioOldValue = res['result'].data;
        if (flag == 2) {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Email Settings Updated Successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      }
    })
  }
}
