import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { EventDataService } from '@app/shared/services/event.service';
import { CommonService } from '@app/common/common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
// import { environment } from '@env/environment';
import { environment } from 'environments/environment';

import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
// import { SnakbarService } from '@app/shared/component/snakbar/snakbar.service';
// import { JSEncrypt } from 'jsencrypt';
const app = window['appSettings'];

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile2.component.html',
  styleUrls: ['./user-profile2.component.scss']
})
export class UserProfile2Component implements OnInit {
  emailRgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public registerForm: FormGroup;
  newPasswordForm: FormGroup;
  app = app;
  public imageData;
  public imageChangedEvent;
  public croppedImage;
  public disablesSave = true;
  public defaultImage;
  public user;
  public assetsPath;
  logoUrl: any = null;
  logoAttachId: any = 0;
  private imageUploadUrl = app.api_url + 'uploadAttachments?container=users';
  public userRolesList = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }];
  uploaderLogo = new FileUploader({});
  public userProfile = {
    first_name: '',
    last_name: '',
    email: '',
    user_type: '',
    company: '',
    title: ''
  };
  public profile = {
    addLabel: 'Ad Image',
    remove: false
  };
  public baseurl;
  constructor(
    private formBuilder: FormBuilder,
    private _el: ElementRef,
    private _commonService: CommonService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.assetsPath = environment.assetsPath;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.baseurl = window['appSettings'].base_url;
    this.getUser();
    this._commonService.headerShow = false;
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_type: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.pattern(this.emailRgx)]]
    });
    this.newPasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9a-zA-Z!@#$%^&*?]{8,}$/)
        ]
      ],
      reNewPassword: ['', Validators.required]
    });

    this.uploaderLogo = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: app.user.token }]
    });
    this.uploaderLogo.onErrorItem = (item, response, status, headers) => this.onLogoErrorItem(item, response, status, headers);
    this.uploaderLogo.onSuccessItem = (item, response, status, headers) => this.onLogoSuccessItem(item, response, status, headers);

  }
  setFormData(selectedUser) {
    this.registerForm.patchValue({
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name,
      email: selectedUser.email,
      user_type: +selectedUser.user_type
    });
  }
  onLogoSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response); //success server response
    if (data['result'].success) {
      this.logoUrl = data['result'].data.filepath;
      this.croppedImage = data['result'].data.filepath;
      this.logoAttachId = data['result'].data.id;
      this.saveUserProfilePic();
    }
  }
  onLogoErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let error = JSON.parse(response); //error server response
  }
  getBGUrl() {
    return 'url(' + this.croppedImage + '), url(' + this.assetsPath + '/images/user-avatar.png)';
  }
  valChanged() {
    this.disablesSave = false;
  }

  isProfilePicLoaded(status) {
    if (status) {
      this.profile.addLabel = 'Change Image';
      this.profile.remove = true;
    } else {
      this.profile.addLabel = 'Add Image';
    }
  }
  get registration() {
    return this.registerForm.controls;
  }
  get newPassword() {
    return this.newPasswordForm.controls;
  }
  getUser() {
    this._commonService.getApi('getUsers', { id: app.user.id, from: 'profile' }).then(result => {
      if (result['result'].success) {
        this.userProfile = result['result'].data.users_info.users[0];
        this.setFormData(this.userProfile);
        this.croppedImage = this.userProfile['attachment_url'];
      }
    });
  }
  saveUserProfilePic() {
    this._commonService.saveApi('saveUserProfilePic', { id: app.user.id, type: 'save', attachment_id: this.logoAttachId }).then(res => {
      if (res['result'].success) {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { status: 'success', msg: 'User image updated successfully' },
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
  removeUserProfilePic() {
    console.log('delete');
    // this._commonService.saveApi('saveUserProfilePic',{id:app.user.id,type:'delete'}).then(res=>{

    // });
  }
  saveUserProfile() {
    this.registerForm.setErrors({ pristine: true });
    this.registerForm.value['id'] = app.user.id;
    this.registerForm.value['from'] = 'profile';
    this._commonService.saveApi('saveUser', this.registerForm.value).then(res => {
      if (res['result'].success) {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { status: 'success', msg: 'User details updated successfully' },
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      } else {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { status: 'error', msg: res['result'].message },
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
  saveNewPassword() {
    this.newPasswordForm.value['id'] = app.user.id;
    this._commonService.saveApi('changePassword', this.newPasswordForm.value).then(res => {
      if (res['result'].success) {
        if (res['result'].data.status) {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: res['result'].data.msg },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } else {
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'error', msg: res['result'].data.msg },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
        this.newPasswordForm.reset();

      }
    });
  }
  addImage(event: Event): void {
    const el: HTMLElement = document.getElementById('addImage') as HTMLElement;
    el.click();
  }
}
