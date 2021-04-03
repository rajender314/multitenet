import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import { AddUserComponent } from '@app/dialogs/add-user/add-user.component';
import { ConfirmdialogComponent } from '@app/dialogs/confirmdialog/confirmdialog.component';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'environments/environment';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonService } from '@app/common/common.service';
import * as _ from "lodash";

import { AddSubscriptionComponent } from '@app/dialogs/add-subscription/add-subscription.component';
const app = window['appSettings'];

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  public isLoading: boolean = true;
 
  public selectedUser: any;
  public selectedUserId: any = 0;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public indexVal: any = 0;
  public search = '';
  public sizeError:boolean=false;
  public uploadError:boolean=false;
  public assetsPath;
  public usersList: any = [];
  public isSaveAction: boolean = false;
  public baseurl;
  public appurl;
  statusBy = 1;
  activeTab = 1;
  public selectedStatusType: string = 'Active';
  sortBy: string = 'A-Z';
  formdata: any;
  public disableSaveButton: boolean = true;
  params: any = {
    search: '',
    sort: 'ASC',
    statusVal: 1
  };
  public profile = {
    addLabel: 'Ad Image',
    remove: false
  };
  uploads: any = [];
  private imageUploadUrl = app.api_url + 'uploadAttachments?container=users';
  uploader = new FileUploader({});
  logoUrl: any = '';
  logoAttachId: any = 0;
  instancesList: any = [];
  selectedInstancesIds: any = [];
  public userRolesList = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }];
  public statusRolesList = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];
  public priceCurrency = [{ id: 1, name: "Dollar" }, { id: 2, name: "Rupee" },  { id: 3, name: "Euro" }];
  public periodType = [{ id: 1, name: "Days" }, { id: 2, name: "Week" },  { id: 3, name: "Months" },  { id: 4, name: "Year" }];
  public isSubmited: boolean = false;
  public placeholderUrl = "";
  public showSpinner = false;
  constructor(
    private _dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private commonsercvie: CommonService
  ) {
  }
  ngOnInit() {
    console.log(environment);
    this.assetsPath = environment.assetsPath;
    this.baseurl = window['appSettings'].base_url;
    this.appurl = window['appSettings'].app_url;
    this.formdata = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      price: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      price_currency: new FormControl("", [Validators.required]),
      duration_period: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      period_type: new FormControl("", [Validators.required]),
      status: new FormControl(1, [Validators.required]),
      features: this.fb.array([]) 
    });
    this.getSubscriptions();
    this.getGlobalPermissions();

    this.uploader = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: app.user.token }]
    });
    this.uploader.onErrorItem = (item, response, status, headers) => this.onLogoErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onLogoSuccessItem(item, response, status, headers);

  }
  ngOnChanges() {
    console.log(this.commonsercvie.enableSubBtn)
  }
  isProfilePicLoaded(status) {
    if (status) {
      this.profile.addLabel = 'Change Image';
      this.profile.remove = true;
    } else {
      this.profile.addLabel = 'Add Image';
    }
  }
  addImage(event: Event): void {
    event.target['value'] = '';

    const el: HTMLElement = document.getElementById('addImage') as HTMLElement;
    el.click();
  }
  onLogoSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response); //success server response
    if (data['result'].success) {
      this.disableSaveButton = false;
      this.logoUrl = data['result'].data.filepath;
      this.logoAttachId = data['result'].data.id;
      // this.saveUserProfilePic('save');
    }
  }
  saveUserProfilePic(flag) {
    this.commonsercvie.saveApi('saveUserProfilePic', { id: this.selectedUser.id, type: flag, attachment_id: this.logoAttachId }).then(res => {
      if (res['result'].success) {
        this.selectedUser.attachment_url = res['result'].data.attachement_url;
        this.selectedUser.attachment_id = res['result'].data.attachement_id;
        if (flag == 'delete') { 
         
          this.getSubscriptions();
        }
        let msgVal = '';
        if (flag == 'delete') {
          msgVal = 'Subscription image deleted successfully';
        } else {
          msgVal = 'Subscription image updated successfully';
        }
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { status: 'success', msg: msgVal },
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });

      }
    });
  }
  onLogoErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let uploadError = JSON.parse(response); //error server response
    console.log(uploadError);
  }
  public get instances() {
    return this.formdata.get('features') as FormArray;
  }
  createControls() {
    // console.log(this.instancesList)
    this.instancesList.forEach(attr => {
      this.instances.push(this.createFormGroup(attr));
    });
  }
  createFormGroup(attr) {
    return this.fb.group({ [attr.code]: 'no' });
    // return this.fb.group({ [attr.id]: selectedUser.instances[attr.id]?selectedUser.instances[attr.id]:'0' });
  }

  addCustomUser = (term) => ({ id: term, name: term });
  get f() { return this.formdata.controls; }
  public instanceAppName;
  public globalPermissions = [];
  getGlobalPermissions() {
    let params = {}
    this.isLoading = true;
    this.commonsercvie.getApi('getFeatures', params).then(res => {
      console.log(res)
      if (res['result'].success) {
        // this.instanceAppName = res['result'].data[0].name;
        this.globalPermissions = res['result'].data; 
        //this.loadInitials(this.globalPermissions)

      }
    });

  }
  public systemPermissions = [];
  public subscriptionDetails;
  public subscriptionPermissions = []
  getViewSubscriptions(instance) {
    let params = {
      id: instance.id
    }
    this.isLoading = true;
    this.commonsercvie.getApi('viewSubscription', params).then(res => {
      // console.log(res)
      if (res['result'].success) {
        this.isLoading = false;
       this.subscriptionPermissions = res['result'].data.subscription_features;
      //  console.log(this.selectedUser)
       this.loadInitials(this.globalPermissions);

      }
    });

  }

  loadInitials(data: any): void {
    data.map(child => {
      delete child.permission;
      delete child.checked;
      delete child.selectedValue;
      this.subscriptionPermissions.map(getpermission => {
        if (getpermission.id === child.id) {
          child.checked = _.indexOf(getpermission.permission, 1) > -1 ? true : false;
          child.selectedValue = getpermission.permission[0];
          child.permission = getpermission.permission;
        }
      });
      if (child.children) {
        this.loadInitials(child.children);
      }
    });
  }
  getSubscriptions() {
    this.isLoading = true;
    this.commonsercvie.getApi('getSubscriptions', this.params).then(res => {
      if (res['result'].success) {
        this.usersList = res['result'].data.subscriptions;
        // this.instancesList = res['result'].data.features[0].childList;
        if(this.usersList.length) {
          this.getViewSubscriptions(this.usersList[0])
        }
        this.isLoading = false;
        if (this.usersList.length > 0) {
          if (!this.selectedUserId) {
            this.selectedUser = this.usersList[0];
            this.selectedUserId = this.selectedUser.id;
          } else {
            if(this.search) {
              this.selectedUser = this.usersList[0];
            }
            this.usersList.map(row => {
              if (row.id == this.selectedUserId) {
                this.selectedUser = row;
              }
            })
          }
          this.logoUrl = this.selectedUser.attachment_url;
          this.logoAttachId = this.selectedUser.logoattachid;
          this.setFormData(this.selectedUser);
        }
      }
    });

  }
  displayDefaultImage(e) {
    e.target.src = this.appurl + 'public/images/instance.jpg';
  }
  searchUser(search) {
    this.params.search = search;
    this.getSubscriptions();
  }
  getSelectedList(instance, index) {
    // console.log(instance)
    // this.isSaveAction=false; 
    this.selectedUserId = instance.id;
    this.indexVal = index;
    this.errorMessage = '';
    this.selectedUser = instance;
    this.logoUrl = instance.attachment_url;
    this.logoAttachId = instance.logoattachid;
    this.getViewSubscriptions(instance)
    this.setFormData(this.selectedUser);
    this.disableSaveButton = true;

  }
  deletInstance(instance) {

    this._dialog.open(ConfirmdialogComponent, {
      panelClass: 'my-centered-dialog',
      height: '200px',
      width: '400px',
      data: {
        title: 'Delete Instace',
        params: { instance_id: instance.id, name: instance.name },
        action: 'deleteInstace',
        url: 'deleteInstace',
        content: 'Are you sure want to Delete <b>' + instance.name + '</b>..?'
      }
    })
      .afterClosed()
      .subscribe(res => {
        if (res && res.success) {
          this.getSubscriptions();
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Instance deleted successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      })
  }
  setFormData(selectedSub) {
    this.formdata.reset();
    this.createControls();
    this.formdata.patchValue({
      name: selectedSub.name,
      duration_period: selectedSub.duration_period,
      period_type: selectedSub.period_type,
      price: selectedSub.price,
      status: +selectedSub.status,
      price_currency: +selectedSub.price_currency,
      features: selectedSub.features
    }); 
    this.logoUrl = selectedSub.attachment_url;
    this.logoAttachId = selectedSub.logoattachid;
  }
  saveSubscription() {
    // this.saveUserProfilePic('save');
    this.systemPermissions = [];
    this.loadPermissions(this.globalPermissions);
    this.isSaveAction = true;
    this.params['system_permissions'] = this.systemPermissions;
    let data = this.formdata.value;
    this.isSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    if (this.formdata.valid) {
      this.disableSaveButton = true;
      this.showSpinner = true;
      this.params = data;
      this.params.id = this.selectedUser.id;
      this.params.sort = this.sortBy;
      this.params.statusVal = this.statusBy;
      this.params.logoAttachId = this.logoAttachId;
      this.params['system_permissions'] = this.systemPermissions;
      this.submitted = true;
      this.commonsercvie.saveApi('saveSubscription', this.params).then(res => {
        if (res['result'].success) {
          this.isSaveAction = false;
          this.isSubmited = false;
          this.showSpinner = false;
          this.getSubscriptions();
          this.disableSaveButton = true;
          // this.usersList[this.indexVal].name = data.name;
          this.submitted = false;
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Subscription updated successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
          this.selectedUser = this.usersList.find(item => item.id === this.selectedUser.id);
        } else {
          this.showSpinner = false;
          this.isSaveAction = false;
          this.isSubmited = false;
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: res['result'].data },
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 5000,
          });
          if (res['result'].status_code == 401) {
            this.errorMessage = res['result'].data;
          }
        }
      });
    } else {
      this.disableSaveButton = true;
      this.isSaveAction = false;
      this.showSpinner = false;
    }
  }
  permissionData(event) {
    // console.log(event)
    this.disableSaveButton = false;
  }

  loadPermissions(data: any): void {
    data.map(value => {
      if (_.findIndex(this.systemPermissions, { id: value.id }) === -1 && value.permission) {
        if (value.permission.length) {
          this.systemPermissions.push({ id: value.id, permission: value.permission });
          // console.log(this.systemPermissions)
        }
      }
      if (value.children) {
        this.loadPermissions(value.children);
      }
    });
  }
  addUser() {
    this._dialog.open(AddSubscriptionComponent, {
      panelClass: 'overlay-dialog',
      height: '500px',
      width: '600px',
      data: {
        title: 'Add Subscription',
        params: { instances: this.instancesList },
        action: 'saveIUser',
        url: 'saveIUser',
        content: 'Are you sure want to Add'
      }
    })
      .afterClosed()
      .subscribe(response => {
        if (response && response.success) {
          // this.commonsercvie.saveApi('saveInstance', response.params).then(res => {
          //   if (res['result'].success) {
          this.getSubscriptions();
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Subscription added successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          //   }
          // });
        }
      })
  }

  onApplyFilter = (prop, obj?) => {
    this.params.page = 1;
    if (prop == 'sort') {
      this.sortBy = this.sortBy == 'A-Z' ? 'Z-A' : 'A-Z';
      this.params.sort = this.sortBy == 'A-Z' ? 'asc' : 'desc';
      this.getSubscriptions();
    } else {
      if (obj != this.statusBy) {
        if (obj == 1) {
          this.selectedStatusType = 'Active';
          this.statusBy = 1;
        } else if (obj == 2) {
          this.selectedStatusType = 'Inactive';
          this.statusBy = 2;
        } else if (obj == 0) {
          this.selectedStatusType = '';
          this.statusBy = 0;
        }
        this.params.statusVal = obj;
        this.getSubscriptions();
      }
    }
  }
  checkIntanceExist(instanceId) {
    if (this.selectedUser.instances.includes(instanceId)) {
      return true;
    } else {
      return false;
    }
  }
  valueChanged() {
    this.disableSaveButton = false;
  }
  resetForm() {
    this.disableSaveButton = true;
    this.setFormData(this.selectedUser);
  }

  imgError(image) {
    image.onerror = "";
    image.src = this.placeholderUrl;
    return true;
  }
  clearSearch() {
    this.params.search = '';
    this.search = '';
    this.getSubscriptions();
  }
}
