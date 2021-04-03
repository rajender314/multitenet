import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CommonService } from '@app/common/common.service';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {
  public submitted: boolean = false;
  public errors: boolean = false;
  addFormdata: any;
  params: any;
  selectedInstancesIds: any = [];
  public errorMessage: string = '';
  public isSubmited: boolean = false;
  constructor(private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private commonsercvie: CommonService) { }
  promise: any;
  instancesList: any; 
  loader = false;
  public userRolesList = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }];
  public statusRolesList = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];
  public appurl;
  public disablesSave = false;
  ngOnInit() {
    this.appurl = window['appSettings'].app_url;
    this.addFormdata = new FormGroup({
      first_name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      last_name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      email: new FormControl("", [Validators.required,Validators.email, Validators.maxLength(255)]),
      user_type: new FormControl(1, [Validators.required]),
      status: new FormControl(1, [Validators.required]),
      instances: this.fb.array([])
    });
    this.instancesList = this.data.params.instances;
    this.createControls();
  }
  get f() { return this.addFormdata.controls; }
  public get instances() {
    return this.addFormdata.get('instances') as FormArray;
  }
  closeDialog() {
    this.submitted = false;
    this.dialogRef.close({ success: false });
  }
  createControls() {
    this.instancesList.forEach(attr => {
      this.instances.push(this.createFormGroup(attr));
    });
  }
  createFormGroup(attr) {
    return this.fb.group({ [attr.id]: 'no' });
  }
  saveUser() {
    let data = this.addFormdata.value;
    this.isSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    if (this.addFormdata.valid) {
      this.disablesSave = true;
      this.params = data;
      this.params.id = '';
      this.params.instances = this.selectedInstancesIds;
      this.submitted = true;
      this.commonsercvie.saveApi('saveUser', this.params).then(res => {
        if (res['result'].success) {
          this.isSubmited = false;
          this.dialogRef.close({ success: true });
          this.submitted = false;
          this.disablesSave = false;
        } else {
          this.isSubmited = false;
          if (res['result'].status_code == 401) {
            this.errorMessage = res['result'].data;
          }
        }
      });
    } else {
      this.disablesSave = false;
    }
  }

  check(event, inst): void {  
    if(event.checked) {
      this.selectedInstancesIds.push(inst.id)  
    }  else {
      this.selectedInstancesIds = this.selectedInstancesIds.filter(function (i) {
        return inst.id!=i;
      }); 
    }
    //console.log(this.selectedInstancesIds)
  }


  onChange(event, index, item) {
    if (event.checked) {
      this.selectedInstancesIds.push(item.id);
    }

    if (!event.checked) {
      let index = this.selectedInstancesIds.indexOf(item.id);
      if (index > -1) {
        this.selectedInstancesIds.splice(index, 1);
      }
    }
  }

  displayDefaultImage(e){
    e.target.src = this.appurl + 'public/images/instance.jpg';
  }
}
