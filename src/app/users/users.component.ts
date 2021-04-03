import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmdialogComponent } from '@app/dialogs/confirmdialog/confirmdialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '@app/common/common.service';
import { AddUserComponent } from '@app/dialogs/add-user/add-user.component';
import { ReturnStatement } from '@angular/compiler';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'environments/environment';

const app = window['appSettings'];
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  public isLoading: boolean = true;
 
  public selectedUser: any;
  public selectedUserId: any = 0;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public indexVal: any = 0;
  public search = '';
  public assetsPath;
  public usersList: any = [];
  public isSaveAction: boolean = false;
  public baseurl;
  public appurl;
  public errors:boolean=false;
  public uploadError:boolean=false;
  public sizeError:boolean=false;
  statusBy = 1;
  activeTab = 1;
  public selectedStatusType: string = 'Active';
  sortBy: string = 'A-Z';
  formdata: any;
  public disableSaveButton: boolean = true;
  totalPages: number;
  public showSpinner = false;
  params: any = {
    page: 1,
    perPage: 7,
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
  logoUrl: any = 'http://172.17.0.1:8080/product/app/storage/app/UserImages/1578468609.png';
  logoAttachId: any = 0;
  instancesList: any = [];
  selectedInstancesIds: any = [];
  public userRolesList = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }];
  public statusRolesList = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];
  public isSubmited: boolean = false;
  public placeholderUrl = "http://www.landscapingbydesign.com.au/wp-content/uploads/2018/11/img-person-placeholder.jpg";
  public instanceDropdown = [];
  constructor(
    private _dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private commonsercvie: CommonService
  ) {
  }
  ngOnInit() {
    this.assetsPath = environment.assetsPath;
    this.baseurl = window['appSettings'].base_url;
    this.appurl = window['appSettings'].app_url;
    this.formdata = new FormGroup({
      first_name: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(255)])),
      last_name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      email: new FormControl("", [Validators.required,Validators.email, Validators.maxLength(255)]),
      user_type: new FormControl("1", [Validators.required]),
      status: new FormControl("1", [Validators.required]),
      // instances: new FormControl("1", [Validators.required]),
      instances: this.fb.array([])
    });
    this.getUsers();
    this.getInstances();
    this.uploader = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: app.user.token }]
    });
    this.uploader.onErrorItem = (item, response, status, headers) => this.onLogoErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onLogoSuccessItem(item, response, status, headers);
    // console.log(1222)
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
    // console.log(data)
    if (data['result'].success) {
      this.disableSaveButton = false;
      this.logoUrl = data['result'].data.filepath;
      this.logoAttachId = data['result'].data.id;
      // this.saveUserProfilePic('save');
    }
  }

  deleteUserProfilePic(flag) {
    this.disableSaveButton = false;
    // this.selectedUser.attachment_url = '';
    // this.selectedUser.attachment_id = 0;
    // this.logoUrl = '';
    this.logoAttachId = 0


  }
  saveUserProfilePic(flag) {
    // console.log(2222)
  
    this.commonsercvie.saveApi('saveUserProfilePic', { id: this.selectedUser.id, type: flag, attachment_id: this.logoAttachId }).then(res => {
      if (res['result'].success) {
        this.selectedUser.attachment_url = res['result'].data.attachement_url;
        this.selectedUser.attachment_id = res['result'].data.attachement_id;
        if (flag == 'delete') {
          // console.log(this.usersList[this.indexVal]); 
          // this.logoUrl = this.selectedUser.attachment_url;
          // this.logoAttachId = this.selectedUser.attachment_id;
          this.getUsers();
        }
        // let msgVal = '';
        // if (flag == 'delete') {
        //   msgVal = 'User image deleted successfully';
        //   this.snackbar.openFromComponent(SnackbarComponent, {
        //     data: { status: 'success', msg: msgVal },
        //     verticalPosition: 'top',
        //     horizontalPosition: 'right'
        //   });
        // } 
       

      }
    });
    // console.log(this.disableSaveButton)
    // console.log(this.isSaveAction)

  }

  getInstances(fromFilter = false) {
    this.commonsercvie.getApi('getInstances', this.params).then(res => {
      if (res['result'].success) {
        this.instanceDropdown = res['result'].data.instances;
        this.instanceDropdown.unshift({id: 'select', name: 'Select Instance'})
        // console.log(this.instanceDropdown)
      }
    });
  }
  onLogoErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let uploadError = JSON.parse(response); //error server response
    console.log(uploadError);
  }
  public get instances() {
    return this.formdata.get('instances') as FormArray;
  }
  createControls() {
    this.instancesList.forEach(attr => {
      this.instances.push(this.createFormGroup(attr));
    });
  }
  createFormGroup(attr) {
    return this.fb.group({ [attr.id]: 'no' });
    // return this.fb.group({ [attr.id]: selectedUser.instances[attr.id]?selectedUser.instances[attr.id]:'0' });
  }

  onScroll(): void {
    // console.log(123)
    return
    if (this.params.page < this.totalPages && this.totalPages != 0) {
      this.params.page++;
      this.getUsers('pagination');
    }
  }

  forceLogout() {
    this._dialog.open(ConfirmdialogComponent, {
      panelClass: 'my-centered-dialog',
      height: '200px',
      width: '400px',
      data: {
        title: 'Force Logout',
        params: { id: this.commonsercvie.userId },
        action: 'forceLogout',
        url: 'forceLogout',
        method: 'post',
        content: ` Are you sure you want to Logout forcefully?`
      }
    })
      .afterClosed()
      .subscribe(res => {
        if (res && res.success) {
         
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Forced logout successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      })
   
  }

  loadMore(param) {
    this.params = param
    this.getUsers();
  }
  resetPassword() {
    // console.log(123)
    this._dialog.open(ConfirmdialogComponent, {
      panelClass: 'my-centered-dialog',
      height: '200px',
      width: '400px',
      data: {
        title: 'Reset Password',
        params: { id: this.commonsercvie.userId },
        action: 'resetPassword',
        url: 'resetPassword',
        method: 'post',
        content: `Password Reset link will be sent to ${this.commonsercvie.emailId}.
        Are you sure you want to reset your password?`
      }
    })
      .afterClosed()
      .subscribe(res => {
        if (res && res.success) {
         
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Password Reset successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      })
   
  }

  addCustomUser = (term) => ({ id: term, name: term });
  get f() { return this.formdata.controls; }
  public totalUsers;
  getUsers(cb?) {
    this.isLoading = true;
    this.commonsercvie.getApi('getUsers', this.params).then(res => {
      if (res['result'].success) {
        this.usersList = res['result'].data.users_info.users;
        this.instancesList = res['result'].data.instances;

        // this.instanceDropdown = res['result'].data.instances;
        // this.instanceDropdown.unshift({id: 'select', name: 'Select Instance'})

        // console.log(this.instancesList)
        // this.instancesList.splice(1, 1)
     
        // console.log(this.instancesList)

        this.totalUsers = res['result'].data.users_info.count;
        this.totalPages = 2500;
        this.isLoading = false;
        // if (cb) this.usersList = [];
        // let data = res['result'].data.users;
        // data.map(res => {
        //   this.usersList.push(res);
        // });
        if (this.usersList.length > 0) {
          this.commonsercvie.userId = this.usersList[0].id;
          this.commonsercvie.emailId = this.usersList[0].email;
          if (!this.selectedUserId) {
            // this.selectedUser = this.usersList[0];
            // this.selectedUserId = this.selectedUser.id;
          } else {
            this.usersList.map(row => {
              if (row.id == this.selectedUserId) {
                this.selectedUser = row;
              }
            })
          }
          // this.setFormData(this.selectedUser);
        }
        this.setFormData(this.usersList[0]);
        this.selectedUser = this.usersList[0];
        this.selectedUserId = this.selectedUser.id;
      }
    });

  }

  check(event, inst): void { 
    this.disableSaveButton = false;
    if(event.checked) {
      this.selectedInstancesIds.push(inst.id)  
    }  else {
      this.selectedInstancesIds = this.selectedInstancesIds.filter(function (i) {
        return inst.id!=i;
      }); 
    }
    console.log(this.selectedInstancesIds)
  }

  onInstanceChanges(event) {
    // console.log(event)
    if(event == 'select') {
     delete this.params['instanceId'] ;
      this.getUsers();
    } else {
      this.params['instanceId'] = event;
      this.getUsers();
    }
    
  }
  displayDefaultImage(e) {
    e.target.src = this.appurl + 'public/images/instance.jpg';
  }
  searchUser(search) {
    this.params.search = search;
    this.getUsers();
  }
  public userInstances = [];
  getSelectedList(instance, index) {
    this.selectedInstancesIds = instance.user_instances; 
    this.selectedUserId = instance.id;
    this.commonsercvie.userId = this.selectedUserId;
    this.commonsercvie.emailId = instance.email;
    this.indexVal = index;
    this.errorMessage = '';
    this.selectedUser = instance;
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
          this.getUsers();
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Instance deleted successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      })
  }
  setFormData(selectedUser) {
    // console.log(selectedUser)
    this.formdata.reset();
    this.createControls();
    this.formdata.patchValue({
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name,
      email: selectedUser.email,
      status: +selectedUser.status,
      user_type: +selectedUser.user_type,
      instances: selectedUser.instances
    });
    this.logoUrl = selectedUser.attachment_url;
    this.logoAttachId = selectedUser.attachment_id;

    // console.log(this.formdata)
  }
  saveUser() {
   this.saveUserProfilePic('save');

    this.isSaveAction = true;
    let l = this.instancesList.length;
    this.formdata.value.instances = this.formdata.value.instances.splice(0, l);
    let data = this.formdata.value;
    
    this.isSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    if (this.formdata.valid) {
      this.showSpinner = true;
      this.params = data;
      this.params.id = this.selectedUser.id;
      this.params.sort = this.sortBy;
      this.params.statusVal = this.statusBy;
      this.params.instances = this.selectedInstancesIds;
      this.submitted = true;
      this.commonsercvie.saveApi('saveUser', this.params).then(res => {
        if (res['result'].success) {
          this.isSaveAction = false;
          this.isSubmited = false;
          this.getUsers();
          this.disableSaveButton = true;
          // this.usersList[this.indexVal].name = data.name;
          this.submitted = false;
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'User updated successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.selectedUser = this.usersList.find(item => item.id === this.selectedUser.id);
          this.showSpinner = false;
        } else {
          this.isSaveAction = false;
          this.isSubmited = false;
          if (res['result'].status_code == 401) {
            this.errorMessage = res['result'].data;
          }
          this.showSpinner = false;

        }
      });
    } else {
      this.isSaveAction = false;
    }
  }
  addUser() {
    this._dialog.open(AddUserComponent, {
      panelClass: 'overlay-dialog',
      height: '500px',
      width: '600px',
      data: {
        title: 'Add User',
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
          this.getUsers();
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'User added successfully' },
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
      this.getUsers();
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
        this.getUsers();
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
    this.getUsers();
  }
}