import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConfirmdialogComponent } from '@app/dialogs/confirmdialog/confirmdialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '@app/common/common.service';
import { AddinstanceComponent } from '../../dialogs/addinstance/addinstance.component';
import { HttpClient } from "@angular/common/http";
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import * as _ from 'lodash';

var APP = window['appSettings'];

@Component({
  selector: 'app-instance-details',
  templateUrl: './instance-details.component.html',
  styleUrls: ['./instance-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstanceDetailsComponent implements OnInit {
  APP = APP;
  public isActivitySpinner: boolean = true;
  public selectedTab: string = 'details';
  public instacesList: any = [];
  public selectedInstance: any;
  public submitted: boolean = false;
  public subscriptions: any;
  public errorMessage: string = '';
  public indexVal: any = 0;
  public isLoading: boolean = true;
  public search = '';
  public isFirstSubmited: boolean = false;
  public isSecondSubmited: boolean = false;
  public isThirdSubmited: boolean = false;
  public assetsPath;
  public baseurl;
  public appurl;
  statusBy = 1;
  public selectedStatusType: string = '';
  sortBy: string = 'A-Z';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup = new FormGroup({});
  selectedId: any;
  imageUrl: any;
  features: any;
  public imagePath;
  url: any;
  editFile: boolean = true;
  removeUpload: boolean = false;
  params: any = {
    search: '',
    sort: 'ASC',
    statusVal: 0,
    features: ''
  };
  public statusRolesList = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];
  logoUrl: any = null;
  logoAttachId: any = 0;
  instanceActivity: any;
  InstancelogoUrl: any = null;
  InstancelogoAttachId: any = 0;
  loginBackUrl: any = null;
  loginBackAttachId: any = 0;
  private imageUploadUrl = APP.api_url + 'uploadAttachments?container=images';
  // uploaderLogo = new FileUploader({});
  uploaderLoginBack = new FileUploader({});
  uploaderInstanceLogo = new FileUploader({});
  public isSubmited: boolean = false;
  public disableSaveButton: boolean = true;
  public maxSizeErrorInstanceLogo: boolean = false;
  public maxSizeErrorLoginBackLogo: boolean = false;
  public extensionErrorInstanceLogo: boolean = false;
  public extensionErrorLoginBackLogo: boolean = false;
  public isSaveAction: boolean = false;
  public families = [
    { id: 1, name: "IBM Plex Sans" },
    { id: 2, name: "Lato" },
    { id: 3, name: "Roboto" }
  ];
  public colorPicker = {
    primary_color: null,
    secondary_color: null,
    header_color: null,
    footer_color: null,
    body_color: null
  }
  public databases: any;
  constructor(
    private _dialog: MatDialog,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private commonsercvie: CommonService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private _route: ActivatedRoute, private _router: Router
  ) {

    this.activatedRoute.params.subscribe(param => this.commonsercvie.instanceId = param.id);

    console.log(this.commonsercvie.instanceId)
   }
  ngOnInit() {
    this.assetsPath = environment.assetsPath;
    this.baseurl = window['appSettings'].base_url;
    this.appurl = window['appSettings'].app_url;
    this.getDatabases();
    this.getFeatures();
    this.selectedId = this._route.snapshot.paramMap.get('id');
    this.firstFormGroup = new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(255)])),
      url: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(255)])),
      subscription: new FormControl("", [Validators.required]),
      status: new FormControl("1", [Validators.required]) 
    });

    this.secondFormGroup = new FormGroup({
      font_style: new FormControl("", [Validators.required]),
      theme_name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      custom_css: new FormControl("", []),
    });
    this.getInstances();
    this.uploaderLoginBack = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: APP.user.token }]
    });
    this.uploaderLoginBack.onErrorItem = (item, response, status, headers) => this.onLoginBackErrorItem(item, response, status, headers);
    this.uploaderLoginBack.onSuccessItem = (item, response, status, headers) => this.onLoginBackSuccessItem(item, response, status, headers);
    this.uploaderLoginBack.onWhenAddingFileFailed = (item, filter) => this.onWhenAddingLoginBackFileFailed(item, filter);
    this.uploaderInstanceLogo = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: APP.user.token }]
    });
    this.uploaderInstanceLogo.onErrorItem = (item, response, status, headers) => this.onInstanceLogoErrorItem(item, response, status, headers);
    this.uploaderInstanceLogo.onSuccessItem = (item, response, status, headers) => this.onInstanceLogoSuccessItem(item, response, status, headers);
    this.uploaderInstanceLogo.onWhenAddingFileFailed = (item, filte) => this.onWhenAddingInstanceLogoFileFailed(item, filte);


  
  }
  onWhenAddingLoginBackFileFailed(item, filter) {
    if ((item.size / 1000000) > 1) {
      this.maxSizeErrorLoginBackLogo = true;
      this.extensionErrorLoginBackLogo = false;
    } else {
      this.maxSizeErrorLoginBackLogo = false;
      this.extensionErrorLoginBackLogo = true;
    }
  }
  onWhenAddingInstanceLogoFileFailed(item, filte) {
    // console.log(filter);
    if ((item.size / 1000000) > 1) {
      this.maxSizeErrorInstanceLogo = true;
      this.extensionErrorInstanceLogo = false;
    } else {
      this.maxSizeErrorInstanceLogo = false;
      this.extensionErrorInstanceLogo = true;
    }
  }
  onInstanceLogoSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response); //success server response
    if (data['result'].success) {
      this.maxSizeErrorInstanceLogo = false;
      this.extensionErrorInstanceLogo = false;
      this.disableSaveButton = false;
      this.InstancelogoUrl = data['result'].data.filepath;
      this.InstancelogoAttachId = data['result'].data.id;
      // this.selectedInstance.instancelogoUrl = data['result'].data.filepath;
      // this.selectedInstance.instancelogoAttchId = data['result'].data.id;
    }
  }
  onInstanceLogoErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    if (item.isError) {
      if ((item['file'].size / 1000000) > 1) {
        this.maxSizeErrorInstanceLogo = true;
        this.extensionErrorInstanceLogo = false;
      }
    }
  }

  onLoginBackSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response); //success server response
    if (data['result'].success) {
      this.maxSizeErrorLoginBackLogo = false;
      this.extensionErrorLoginBackLogo = false;
      this.disableSaveButton = false;
      this.loginBackUrl = data['result'].data.filepath;
      this.loginBackAttachId = data['result'].data.id;
    }
  }
  onLoginBackErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    if (item.isError) {
      if ((item['file'].size / 1000000) > 1) {
        this.maxSizeErrorLoginBackLogo = true;
        this.extensionErrorLoginBackLogo = false;
      }
    }
  }
  removeAttachment(flag, fileInput) {
    fileInput.value = '';
    if (flag == 'logo') {
      this.InstancelogoUrl = '';
      this.InstancelogoAttachId = 0;
    }
    if (flag == 'login-back') {
      this.loginBackUrl = '';
      this.loginBackAttachId = 0;
      this.logoAttachId = 0;
    }
    this.disableSaveButton = false;
  }
  get firstForm() { return this.firstFormGroup.controls; }
  get secondForm() { return this.secondFormGroup.controls; }
  getInstanceActivity() {
    this.commonsercvie.getApi('getInstanceActivity', { 'id': this.selectedId }).then(res => {
      if (res['result'].success) {
        this.isActivitySpinner = false;
        this.instanceActivity = res['result'].data.logs;
      }
    })
  }
  public dbError;
  public envError;
  getInstances(fromFilter = false) {
    this.isLoading = true;
    this.commonsercvie.getApi('getInstances', this.params).then(res => {
      if (res['result'].success) {
        this.instacesList = res['result'].data.instances;
        // if(this.commonsercvie.instanceId == undefined) {
        //   this.commonsercvie.instanceId = this.instacesList[0].id;
        // }
        if(this.instacesList.length) {
          this.dbError = this.instacesList[0]['db_error'] != null ? this.instacesList[0]['db_error'] : '---';
          this.envError = this.instacesList[0]['env_error'] != null ? this.instacesList[0]['env_error'] : '---';
        }
       
        console.log(this.commonsercvie.instanceId)
        this.subscriptions = res['result'].data.subscriptions;


        let indx =  _.findIndex(this.instacesList, {
          id:  parseInt(this.commonsercvie.instanceId)
        })
        console.log(indx)
        if(indx > -1) {
          this.instanceCode = this.instacesList[indx]['code'];

        }
        // console.log(this.instanceCode)
        this.isLoading = false;
        if (this.instacesList.length > 0) {
          if (!fromFilter) {
            if (!this.selectedId) { 
              this.selectedId = this.instacesList[0].id;
              this.selectedInstance = this.instacesList[0];
              this._router.navigate(['/instances', this.instacesList[0].id]);
            } else {
              this.instacesList.map(row => {
                if (row.id == this.selectedId) {
                  this.selectedInstance = row;
                }
              })
            }
          } else {
            this.selectedId = this.instacesList[0].id;
            this.selectedInstance = this.instacesList[0];
            this._router.navigate(['/instances', this.instacesList[0].id]);
          }
          this.setFormData(this.selectedInstance);
        }
      }
    });
  }
  searchInstance(search) {
    this.params.search = search;
    this.getInstances();
  }
  public instanceCode = '';
  getSelectedList(instance, index) {
    console.log(instance)
    this.selectedId = instance.id;
    this.instanceCode = instance.code;
    console.log(this.instanceCode)
    this.commonsercvie.instanceId = this.selectedId;
    this.dbError = instance.db_error != null ? instance.db_error : '---';
    this.envError = instance.env_error != null ? instance.env_error : '---';
    this.indexVal = index;
    this.errorMessage = '';
    this.selectedInstance = instance;
    this.firstFormGroup.reset();
    this.setFormData(this.selectedInstance);
    this.disableSaveButton = true;
  }
  deleteInstance() {
    console.log(this.commonsercvie.instanceId)
   let dialogRef = this._dialog.open(ConfirmdialogComponent, {
      panelClass: 'my-centered-dialog',
      height: '200px',
      width: '400px',
      data: {
        title: 'Delete Instance',
        params: { id: this.commonsercvie.instanceId, code:  this.instanceCode },
        action: 'deleteInstace',
        url: 'deleteInstance',
        content: 'Are you sure want to Delete this instance?'
      }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        console.log(res)
        if (res == true || res['success']) {
          console.log(2222)
          this.getInstances();
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Instance deleted successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });

          this._router.navigate(['/instances']);
        }
      })
  }
  setFormData(selectedInstance) {
    // this.firstFormGroup.reset();
    this.firstFormGroup.patchValue({
      name: selectedInstance.name,
      url:  selectedInstance.url,
      subscription: selectedInstance.subscription,
      status: +selectedInstance.status
    });
    this.databases.map(row => {
      row.fields.map(item => {
        let key = item.key;
        this.firstFormGroup.patchValue(selectedInstance.database_values);
      });
    })

    this.secondFormGroup.patchValue({
      font_style: +selectedInstance.font_style,
      theme_name: selectedInstance.theme_name,
      custom_css: selectedInstance.custom_css,
    });
    this.colorPicker.primary_color = selectedInstance.primary_color;
    this.colorPicker.secondary_color = selectedInstance.secondary_color;
    this.colorPicker.body_color = selectedInstance.body_color;
    this.colorPicker.header_color = selectedInstance.header_color;
    this.colorPicker.footer_color = selectedInstance.footer_color;

    // this.colorPicker['btn_bgColor'] = selectedInstance.btn_bgColor;
    // this.colorPicker['btn_textColor'] = selectedInstance.btn_textColor;
    // this.colorPicker['btn_hoverColor'] = selectedInstance.btn_hoverColor;
    

    // this.colorPicker['secBtn_bgColor'] = selectedInstance.secBtn_bgColor;
    // this.colorPicker['secBtn_textColor'] = selectedInstance.secBtn_textColor;
    // this.colorPicker['secBtn_hoverColor'] = selectedInstance.secBtn_hoverColor;

    // this.colorPicker['textBtn_textColor'] = selectedInstance.textBtn_textColor;
    // this.colorPicker['textBtn_hoverColor'] = selectedInstance.textBtn_hoverColor;

    this.logoUrl = selectedInstance.logoUrl;
    this.logoAttachId = selectedInstance.logoAttachId;
    this.loginBackUrl = selectedInstance.loginBackUrl;
    this.loginBackAttachId = selectedInstance.loginBackAttachId;
    this.InstancelogoUrl = selectedInstance.instancelogoUrl;
    this.InstancelogoAttachId = selectedInstance.instancelogoAttchId;

    // this.features.map(row => {
    //   row.childList.map(child => {
    //     let value = '';
    //     if (child.type == 'radio' || child.type == 'select') {
    //       value = 'no';
    //     }
    //     this.thirdFormGroup.controls[child.code].setValue(selectedInstance.features[child.code] ? selectedInstance.features[child.code] : value);
    //   })
    // })
  }
  public showSpinner = false;
  saveInstance() {
    this.isSaveAction = true;
    let flag = this.selectedTab;
    this.isSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    let msg = '';
    if (flag == 'theme') {
      msg = "Theme";
      this.isSecondSubmited = true;
      let data = this.secondFormGroup.value;
      data.primary_color = this.colorPicker.primary_color;
      data.secondary_color = this.colorPicker.secondary_color;
      data.header_color = this.colorPicker.header_color;
      data.body_color = this.colorPicker.body_color;
      data.footer_color = this.colorPicker.footer_color;

      // data.btn_bgColor = this.colorPicker['btn_bgColor'];
      // data.btn_textColor = this.colorPicker['btn_textColor'];
      // data.btn_hoverColor =  this.colorPicker['btn_hoverColor']

      // data.secBtn_bgColor = this.colorPicker['secBtn_bgColor'];
      // data.secBtn_textColor = this.colorPicker['secBtn_textColor'];
      // data.secBtn_hoverColor =  this.colorPicker['secBtn_hoverColor'];

      //  data.textBtn_textColor = this.colorPicker['textBtn_textColor'];
      //  data.textBtn_hoverColor =  this.colorPicker['textBtn_hoverColor']

      this.params = data;
      this.params.logoAttachId = this.logoAttachId;
      this.params.loginBackAttachId = this.loginBackAttachId;
      if (!this.secondFormGroup.valid || !this.selectedInstance.primary_color || !this.selectedInstance.secondary_color || !this.selectedInstance.header_color || !this.selectedInstance.body_color || !this.selectedInstance.footer_color || !this.secondFormGroup.value.font_style) {
        this.isSaveAction = false;
        this.isSubmited = false;
        return '';
      } else {
        this.isSecondSubmited = false;
        this.showSpinner = true;

      }
    }
    if (flag == 'details') {
      msg = "Details";
      this.isFirstSubmited = true;
      let data = this.firstFormGroup.value;
      if (data.url.substring(0, 7) == 'http://') {
        data.url = this.firstFormGroup.value.url.substring(7);
      }
      this.params = data;
      this.params.InstancelogoAttachId = this.InstancelogoAttachId;
      if (!this.firstFormGroup.valid) {
        this.isSaveAction = false;
        this.isSubmited = false;
        return '';
      } else {
        this.isFirstSubmited = false;
        this.showSpinner = true;
      }
    }
    if (flag == 'features') {
      msg = "Features";
      let data = this.thirdFormGroup.value;
      this.params.features = data;
    }
    this.params.id = this.selectedInstance.id;
    this.params.flag = flag;
    this.params.sort = this.sortBy;
    this.params.statusVal = this.statusBy;
    this.submitted = true;
    this.commonsercvie.saveApi('saveInstance', this.params).then(res => {
      if (res['result'].success) {
        this.isSaveAction = false;
        this.maxSizeErrorInstanceLogo = false;
        this.maxSizeErrorLoginBackLogo = false;
        this.extensionErrorInstanceLogo = false;
        this.extensionErrorLoginBackLogo = false;
        this.isSubmited = false;
        this.getInstances();
        // this.instacesList[this.indexVal].name = data.name;
        this.submitted = false;
        this.disableSaveButton = true;
        this.showSpinner = false;
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { status: 'success', msg: 'Instance ' + msg + ' updated successfully' },
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        setTimeout(() => {
          this._router.navigate(['/instances']);
        }, 1000);

        // this.selectedInstance = this.instacesList.find(item => item.id === this.selectedInstance.id);
      } else {
        this.isSaveAction = false;
        this.isSubmited = false;
        if (res['result'].status_code == 401) {
          this.errorMessage = res['result'].data;
        }
      }
    });

  }

  addInstance() {
    this._dialog.open(AddinstanceComponent, {
      panelClass: 'my-centered-dialog',
      height: '750px',
      width: '600px',
      data: {
        title: 'Add Instance',
        params: {},
        action: 'saveInstance',
        url: 'saveInstance',
        content: 'Are you sure want to Add'
      }
    })
      .afterClosed()
      .subscribe(response => { 
        if (response && response.success) {
          // this.commonsercvie.saveApi('saveInstance', response.params).then(res => {
          //   if (res['result'].success) {
          this.getInstances();
          setTimeout(() => {
            this.snackbar.openFromComponent(SnackbarComponent, {
              data: { status: 'success', msg: 'Instance added successfully' },
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }, 1000);

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
      this.getInstances();
    } else {
      if (obj != this.statusBy) {
        if (obj == 1) {
          this.selectedStatusType = 'Active';
          this.statusBy = 1;
        } else if (obj == 2) {
          this.selectedStatusType = 'InActive';
          this.statusBy = 2;
        } else if (obj == 0) {
          this.selectedStatusType = '';
          this.statusBy = 0;
        }
        this.params.statusVal = obj;
        this.getInstances(true);
      }
    }
  }
  changeTab(tab) {
    this.maxSizeErrorInstanceLogo = false;
    this.maxSizeErrorLoginBackLogo = false;
    this.extensionErrorInstanceLogo = false;
    this.extensionErrorLoginBackLogo = false;
    this.selectedTab = tab;
    this.errorMessage = '';
  }
  valueChanged() {
    this.disableSaveButton = false;
  }
  backToInstances() {
    this._router.navigate(['/instances']);
  }
  public themeInfo;
  getFeatures() {
    this.commonsercvie.getApi('getFeaturesList', []).then(res => {
      if (res['result'].success) {
        this.features = res['result'].data.features;
        this.themeInfo = res['result'].data.theme_info;
        this.features.map(row => {
          row.childList.map(child => {
            let value = '';
            if (child.type == 'radio' || child.type == 'select') {
              value = 'yes';
            }
            this.thirdFormGroup.addControl(child.code, new FormControl(value));
          })
        })
      }
    });
  }
  getDatabases() {
    this.commonsercvie.getApi('getDatabasesList', []).then(res => {
      if (res['result'].success) {
        this.databases = res['result'].data.list;
        this.databases.map(row => {
          row.fields.map(item => {
            this.firstFormGroup.addControl(item.key, new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])));
          });
        });
      }
    });
  }

  resetForm() {
    this.errorMessage = "";
    this.disableSaveButton = true;
    this.maxSizeErrorInstanceLogo = false;
    this.extensionErrorInstanceLogo = false;
    this.maxSizeErrorLoginBackLogo = false;
    this.extensionErrorLoginBackLogo = false;
    this.setFormData(this.selectedInstance);
  }
  getActivity() {
    this.getInstanceActivity();
  }

  updateColor(colorValue, flag) {
    if (flag == 'primary_color') {
      this.colorPicker.primary_color = colorValue
    }
    if (flag == 'secondary_color') {
      this.colorPicker.secondary_color = colorValue
    }
    if (flag == 'header_color') {
      this.colorPicker.header_color = colorValue
    }
    if (flag == 'body_color') {
      this.colorPicker.body_color = colorValue
    }
    if (flag == 'footer_color') {
      this.colorPicker.footer_color = colorValue
    }
    if (flag == 'btn_bgColor') {
      this.colorPicker['btn_bgColor'] = colorValue
    }
    if (flag == 'btn_textColor') {
      this.colorPicker['btn_textColor'] = colorValue
    }
    if (flag == 'btn_hoverColor') {
      this.colorPicker['btn_hoverColor'] = colorValue
    }
    if (flag == 'secBtn_bgColor') {
      this.colorPicker['secBtn_bgColor'] = colorValue
    }
    if (flag == 'secBtn_textColor') {
      this.colorPicker['secBtn_textColor'] = colorValue
    }
    if (flag == 'secBtn_hoverColor') {
      this.colorPicker['secBtn_hoverColor'] = colorValue
    }
   
    if (flag == 'textBtn_textColor') {
      this.colorPicker['textBtn_textColor'] = colorValue
    }
    if (flag == 'textBtn_hoverColor') {
      this.colorPicker['textBtn_hoverColor'] = colorValue
    }
    this.disableSaveButton = false;
  }
  clearSearch() {
    this.params.search = '';
    this.search = '';
    this.getInstances();
  }
  displayDefaultImage(e) {
    e.target.src = this.appurl + 'public/images/instance.jpg';
  }
  fileuploadFun(fileInstancelogoInput) {
    fileInstancelogoInput.value = '';
  }
}

