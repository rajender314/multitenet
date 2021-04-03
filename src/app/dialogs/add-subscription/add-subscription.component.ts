import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CommonService } from '@app/common/common.service';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import * as _ from "lodash";

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AddSubscriptionComponent implements OnInit {
  public submitted: boolean = false;
  addFormdata: any;
  params: any;
  selectedInstancesIds: any = [];
  public errorMessage: string = '';
  public isSubmited: boolean = false;
  constructor(private dialogRef: MatDialogRef<AddSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private commonsercvie: CommonService) { }
  promise: any;
  instancesList: any; 
  loader = false;
  public userRolesList = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }];
  public statusRolesList = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];
  public priceCurrency = [{ id: 1, name: "Dollar" }, { id: 2, name: "Rupee" },  { id: 3, name: "Euro" }];
  public periodType = [{ id: 1, name: "Days" }, { id: 2, name: "Week" },  { id: 3, name: "Months" },  { id: 4, name: "Year" }];
  public appurl;
  public disablesSave = false;
  ngOnInit() {
    this.appurl = window['appSettings'].app_url;
    this.addFormdata = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      price: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      price_currency: new FormControl(1, [Validators.required]),
      duration_period: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      period_type: new FormControl(1, [Validators.required]),
      status: new FormControl(1, [Validators.required]),
      features: this.fb.array([])
    });
    this.instancesList = this.data.params.instances;
    console.log(this.instancesList)
    this.createControls();
    this.getGlobalPermissions();
  }
  get f() { return this.addFormdata.controls; }
  public get instances() {
    return this.addFormdata.get('features') as FormArray;
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
    return this.fb.group({ [attr.code]: 'no' });
  }
  public showPricecurrenyError = false;
  public systemPermissions = [];
  saveUser() {
    console.log(this.addFormdata.value.price_currency)
    this.loadPermissions(this.globalPermissions);
    if(this.addFormdata.value.price_currency == null) {
      this.showPricecurrenyError = true;
    } else {
      this.showPricecurrenyError = false;
    }
    
    let data = this.addFormdata.value;
    this.isSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    if (this.addFormdata.valid) {
      this.disablesSave = true;
      this.params = data;
      this.params.id = '';
      this.params['system_permissions'] = this.systemPermissions;
      this.submitted = true;
      this.commonsercvie.saveApi('saveSubscription', this.params).then(res => {
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
    }  else {
      this.disablesSave = false;
    }
  }
  loadPermissions(data: any): void {
    data.map(value => {
      if (_.findIndex(this.systemPermissions, { id: value.id }) === -1 && value.permission) {
        if (value.permission.length) {
          this.systemPermissions.push({ id: value.id, permission: value.permission });
          console.log(this.systemPermissions)
        }
      }
      if (value.children) {
        this.loadPermissions(value.children);
      }
    });
  }

  public globalPermissions = [];
  getGlobalPermissions() {
    let params = {}
    // this.isLoading = true;
    this.commonsercvie.getApi('getFeatures', params).then(res => {
      console.log(res)
      if (res['result'].success) {
        this.globalPermissions = res['result'].data;
        // this.loadInitials(this.globalPermissions);
      }
    });

  }

  loadInitials(data: any): void {
    data.map(child => {
      delete child.permission;
      delete child.checked;
      delete child.selectedValue;
      // this.subscriptionPermissions.map(getpermission => {
      //   if (getpermission.id === child.id) {
      //     child.checked = _.indexOf(getpermission.permission, 1) > -1 ? true : false;
      //     child.selectedValue = getpermission.permission[0];
      //     child.permission = getpermission.permission;
      //   }
      // });
      if (child.children) {
        this.loadInitials(child.children);
      }
    });
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
