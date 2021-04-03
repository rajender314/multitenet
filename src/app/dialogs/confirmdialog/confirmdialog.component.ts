import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '@app/common/common.service';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.scss']
})
export class ConfirmdialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private commonService: CommonService) { }
  promise: any;
  loader = false;
  buttons: any = {};
  ngOnInit() {
    console.log(this.data)
    if (this.data.title == 'Message') {
      this.buttons = { yes: 'cancel' };
    } else if (this.data.title == "Force Logout") {
      this.buttons = { yes: 'force logout', no: 'cancel' };
    }  else if (this.data.title == "Reset Password") {
      this.buttons = { yes: 'reset', no: 'cancel' };
    } else if (this.data.title == "Session Expired") {
      this.buttons = { yes: 'OK', no: 'cancel' };
    }
     else {
      this.buttons = { yes: 'Delete', no: 'cancel' };
    } 

    // this.data['content'] = 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
  }
  closeDialog() {
    if (this.data.hasOwnProperty('cancelAction')) {
      this.remove({
        type: this.data.type = 'single'
      })
    } else
      this.dialogRef.close({ success: false });
  }
  remove(params?) {
    if (this.data.url) {
      if (!this.promise) {
        this.loader = true;
        if (this.data.method == 'post')
          this.promise = this.commonService.saveApi(this.data.url, params ? { ...this.data.params, ...params } : this.data.params);
        else if (this.data.method == 'get')
          this.promise = this.commonService.getApi(this.data.url, params ? { ...this.data.params, ...params } : this.data.params);
        else
          this.promise = this.commonService.deleteApi(this.data.url, params ? { ...this.data.params, ...params } : this.data.params);
        this.promise
          .then(res  => {
            console.log(res)
            if (res['result'].success) {

              this.dialogRef.close({ success: true, data: { from: params ? 'no' : 'yes', result: res['result'].data } });
            } else {
              this.promise = undefined;
            }
            this.loader = false;
          })
          .catch(err => {
            this.promise = undefined;
            this.loader = false;
          })
      }
    } else {
      this.dialogRef.close({ success: true });
    }
  }
}
