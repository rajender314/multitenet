import { DummyControls } from './../../shared/dummy.json';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CommonService } from '@app/common/common.service';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
// import { _ } from 'ag-grid-community';
import * as _ from 'lodash';
var APP = window['appSettings'];

@Component({
  selector: 'app-addinstance',
  templateUrl: './addinstance.component.html',
  styleUrls: ['./addinstance.component.scss']
})
export class AddinstanceComponent implements OnInit {
  public submitted: boolean = false;
  APP = APP;
  firstFormGroup: any;
  params: any = {
    details: {},
    theme: {},
    features: {}
  };
  // @ViewChild('instanceName', {static: false}) 
  public maxSizeErrorInstanceLogo: boolean = false;
  public maxSizeErrorLoginBackLogo: boolean = false;
  public extensionErrorInstanceLogo: boolean = false;
  public extensionErrorLoginBackLogo: boolean = false;
  public isSecondFromValid: boolean = false;
  public errorMessage: string = '';
  public subscriptions:any;
  public primary_color: string = '';
  public secondary_color: string = '';
  public header_color: string = '';
  public body_color: string = '';
  public footer_color: string = '';
  public nameExistErrorMessage: boolean = false;
  public isFirstSubmited: boolean = false;
  public isSecondSubmited: boolean = false;
  public isThirdSubmited: boolean = false;
  public InstancelogoError: string = '';
  public urlExistErrorMessage = false;
  InstancelogoUrl = '';
  uploaderInstanceLogo = new FileUploader({});
  InstancelogoAttachId: any = 0;
  private imageUploadUrl = APP.api_url + 'uploadAttachments?container=images';
  loginBackUrl = '';
  loginBackAttachId: any = 0;
  uploaderLoginBack = new FileUploader({});
  public bgColor = 'green';
  isLinear = true;
  public statusList = [{ id: 1, name: "Active" }, { id: 0, name: "InActive" }];
  secondFormGroup: FormGroup;
  thirdFormGroup = new FormGroup({});
  constructor(private dialogRef: MatDialogRef<AddinstanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private commonsercvie: CommonService,
    private _formBuilder: FormBuilder
  ) { }
  promise: any;
  loader = false;
  features: any;
  public colorPicker = {
    primary_color: null,
    secondary_color: null,
    header_color: null,
    footer_color: null,
    body_color: null
  }
  public families = [
    { id: 1, name: "IBM Plex Sans" },
    { id: 2, name: "Lato" },
    { id: 3, name: "Roboto" }
  ];
  public state = {
    section: [
      {
        name: 'vehicle',
        type: 'text',
        required: true,
        label: 'Ad Name',
        value: ''
      },
      {
        name: 'week_no',
        type: 'text',
        required: true,
        label: 'Week Number',
        value: ''
      },
      {
        name: 'campaign_id',
        type: 'select',
        required: '',
        label: 'Select Campaign',
        value: ''
      },
      {
        name: 'body_color1',
        type: 'text',
        required: '',
        label: 'Body Color',
        value: ''
      },
      {
        name: 'footer_color11',
        type: 'text',
        required: '',
        label: 'Footer Color',
        value: ''
      },
    ]
  }
  public databases: any;
  public disableSave = false;

  ngOnInit() {
    this.databases = this.data.params['databases'];
    this.subscriptions = this.data.params['subscriptions'];  
    this.getFeatures();
    this.firstFormGroup = new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(255)])),
      url: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(255)])),
      subscription: new FormControl("", [Validators.required]),
      status: new FormControl(1, [Validators.required]),
    }); 
    this.databases.map(row => {
      row.fields.map(item => {
        this.firstFormGroup.addControl(item.key, new FormControl('', Validators.compose([Validators.required, Validators.maxLength(255)])));
      });
    });
    this.secondFormGroup = new FormGroup({
      font_style: new FormControl('', [Validators.required]),
      theme_name: new FormControl("", [Validators.required, Validators.maxLength(255)]),
      custom_css: new FormControl("", []),
    });
    // this.secondFormGroup = this.fb.group({
    //   adDetailsFormValues: this.fb.array([])
    // });
    // this.createControls();
    this.uploaderInstanceLogo = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: APP.user.token }]
    });
    this.uploaderInstanceLogo.onErrorItem = (item, response, status, headers) => this.onInstanceLogoErrorItem(item, response, status, headers);
    this.uploaderInstanceLogo.onSuccessItem = (item, response, status, headers) => this.onInstanceLogoSuccessItem(item, response, status, headers);
    this.uploaderInstanceLogo.onWhenAddingFileFailed = (item, filter) => this.onWhenAddingInstanceLogoFileFailed(item, filter);

    this.uploaderLoginBack = new FileUploader({
      url: this.imageUploadUrl,
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
      maxFileSize: 5 * 1024 * 1024,
      autoUpload: true,
      headers: [{ name: 'X-Jwt-Token', value: APP.user.token }]
    });
    this.uploaderLoginBack.onErrorItem = (item, response, status, headers) => this.onLoginBackErrorItem(item, response, status, headers);
    this.uploaderLoginBack.onSuccessItem = (item, response, status, headers) => this.onLoginBackSuccessItem(item, response, status, headers);
    this.uploaderLoginBack.onWhenAddingFileFailed = (item, filter) => this.onWhenAddingLoginBackFileFailed(item, filter);
  
      //  console.log(DummyControls.controlsData['PAGE_TEMPLATES'])
      //  this.state.section = DummyControls.controlsData['PAGE_TEMPLATES']

  }
  public get adDetailsFormValues() {
    return this.secondFormGroup.get('adDetailsFormValues') as FormArray;
  }
  createControls() {
    let i = 0;
    this.state.section.forEach(attr => {
      this.adDetailsFormValues.push(this.createFormGroup(attr, i));
      i++;
    });
    // this.formReady = true;
  }

  createFormGroup(attr, idx) {
    // if (attr.key === 'dropdown' || attr.key === 'multiple_choice') {
    //   if (attr.get_api) {
    //     this.appService
    //       .getDropdownOptions(attr.get_api, { status: [1, 2] })
    //       .then(res => {
    //         attr.options = res.result.data.data;
    //         this.state.section[idx].options = res.result.data.data;
    //       });
    //   }
    // }

    // if (attr.form_save_value.settings.mandatory) {
    //   if (attr.db_column_key === 'week_no') {
    //     return this.fb.group({
    //       [attr.db_column_key]: [attr.form_save_value.settings.mandatory]
    //         ? [
    //             '',
    //             Validators.compose([
    //               Validators.required,
    //               Validators.min(1),
    //               Validators.max(53),
    //               Validators.pattern('^[0-9]*$')
    //             ])
    //           ]
    //         : ''
    //     });
    //   } else {
    //     return this.fb.group({
    //       [attr.db_column_key]: [attr.form_save_value.settings.mandatory]
    //         ? ['', Validators.required]
    //         : ['', Validators.required]
    //     });
    //   }
    // } else {
      return this.fb.group({
        [attr.name]: ''
      });
    // }
  }
  onWhenAddingInstanceLogoFileFailed(item, filter) {
    if ((item.size / 1000000) > 1) {
      this.maxSizeErrorInstanceLogo = true;
      this.extensionErrorInstanceLogo = false;
    } else {
      this.maxSizeErrorInstanceLogo = false;
      this.extensionErrorInstanceLogo = true;
    }
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

  removeAttachment(flag, fileInput) {
    fileInput.value = '';
    if (flag == 'logo') {
      this.InstancelogoUrl = '';
      this.InstancelogoAttachId = 0;
    }
    if (flag == 'login-back') {
      this.loginBackUrl = '';
      this.loginBackAttachId = 0;
    }
  }
  onInstanceLogoSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    this.InstancelogoError = '';
    if ((item.file.size / 1000) <= 1000) {
      let data = JSON.parse(response); //success server response
      if (data['result'].success) {
        this.maxSizeErrorInstanceLogo = false;
        this.extensionErrorInstanceLogo = false;
        this.InstancelogoUrl = data['result'].data.filepath;
        this.InstancelogoAttachId = data['result'].data.id;
      }
    } else {
      this.InstancelogoError = "Max file size allowed is 1MB";
    }
    // let data = JSON.parse(response); //success server response
    // if (data['result'].success) {
    //   this.InstancelogoUrl = data['result'].data.filepath;
    //   this.InstancelogoAttachId = data['result'].data.id;
    // } 
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

  get firstForm() { return this.firstFormGroup.controls; }
  get secondForm() { return this.secondFormGroup.controls; }
  closeDialog() {
    this.submitted = false;
    this.dialogRef.close({ success: false });
  }
  // updateColor(color) {
  //   document.getElementsByClassName("text_selected")[0] && document.getElementsByClassName("text_selected")[0].closest("text")['instance'].fill(color);
  // }

  public enteredInstance;
  checkInstanceNameExists(instanceName, type) {
  let name;
    if(type == 'name') {
       name  = instanceName.value;
    } else {
      name = instanceName.target.value;
      // console.log(instanceName)
    }
    
   

  //  this.enteredInstance  = name.split(' ');
  //   this.enteredInstance = this.enteredInstance.join('_').toLowerCase();

    if(name.length) {
    this.commonsercvie.saveApi('checkInstanceNameExists', { 'name': name, 'type': type }).then(res => {
      if (res['result'].success) {
        if (res['result'].data.exists != 0) {
          this.nameExistErrorMessage = true;
        } else {
          this.enteredInstance  = res['result'].data.code;
          // console.log(this.enteredInstance)
          this.nameExistErrorMessage = false;
          this.urlExistErrorMessage = false;
        }
      }
    });
  }
  }

  checkInstanceNameExistsUrl(instanceName, type) {
    let name;
      if(type == 'name') {
         name  = instanceName.value;
      } else {
        name = instanceName.target.value;
        console.log(instanceName)
      }
      
     
  
    //  this.enteredInstance  = name.split(' ');
    //   this.enteredInstance = this.enteredInstance.join('_').toLowerCase();
  
      if(name.length) {
      this.commonsercvie.saveApi('checkInstanceNameExists', { 'name': name, 'type': type }).then(res => {
        if (res['result'].success) {
          if (res['result'].data.exists != 0) {
            this.urlExistErrorMessage = true;
          } else {
            // this.enteredInstance  = res['result'].data.code;
            // console.log(this.enteredInstance)
            this.urlExistErrorMessage = false;
          }
        }
      });
    }
    }
  saveInstance() {
    this.disableSave = false;
    let data = this.firstFormGroup.value;
    this.isFirstSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    if (this.firstFormGroup.valid) {

      if (this.firstFormGroup.valid && !this.maxSizeErrorInstanceLogo && !this.extensionErrorInstanceLogo) {
        this.isFirstSubmited = false;
        this.params.details = data;
        this.params.details.InstancelogoAttachId = this.InstancelogoAttachId;
        this.params.id = '';
        this.params.flag = 'add';
        this.submitted = true;
      }

    }


  }
  checkDetailsValid() {
    // if (this.firstFormGroup.valid) {
    //   this.isFirstSubmited = false;
    //   this.saveInstance(); 
    // } else {
    //   this.isFirstSubmited = true;
    // } 
  }
  saveInstanceTheme() {
    this.valueChanged();
    let data = this.secondFormGroup.value;
    this.isSecondSubmited = true;
    // this.isSecondFromValid = false;
    this.errorMessage = '';
    this.submitted = true;
    if (this.secondFormGroup.valid && 
      this.colorPicker.primary_color && this.colorPicker.secondary_color && 
      this.colorPicker.header_color && this.colorPicker.body_color &&
    
       this.colorPicker.footer_color && this.secondFormGroup.value.font_style ) {
      this.isSecondSubmited = false;
      this.isSecondFromValid = true;
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

      // data.textBtn_textColor = this.colorPicker['textBtn_textColor'];
      // data.textBtn_hoverColor =  this.colorPicker['textBtn_hoverColor']
      this.params.theme = data;
      this.params.theme.loginBackAttachId = this.loginBackAttachId;
      this.submitted = true;
      this.params.features = [];
      this.disableSave = true;
      this.commonsercvie.saveApi('saveInstance', this.params).then(res => {
        if (res['result'].success) {
          this.isThirdSubmited = false;
          this.errorMessage = '';
          this.dialogRef.close({ success: true });
          this.submitted = false;
          this.disableSave = false;
        } else {
          this.isThirdSubmited = false;
          if (res['result'].status_code == 401) {
            this.errorMessage = res['result'].data;
          }
        }
      });
    }

  }
  valueChanged() {
    this.isSecondFromValid = false;
    if (this.secondFormGroup.valid && this.colorPicker.primary_color && this.colorPicker.secondary_color && this.colorPicker.header_color && this.colorPicker.body_color && this.colorPicker.footer_color && this.secondFormGroup.value.font_style) {
      this.isSecondFromValid = true;
    }
  }
  saveFeaturesInfo() {
    let data = this.thirdFormGroup.value;
    this.isThirdSubmited = true;
    this.errorMessage = '';
    this.submitted = true;
    if (this.thirdFormGroup.valid) {
      this.params.features = data;
      this.commonsercvie.saveApi('saveInstance', this.params).then(res => {
        if (res['result'].success) {
          this.isThirdSubmited = false;
          this.dialogRef.close({ success: true });
          this.submitted = false;
        } else {
          this.isThirdSubmited = false;
          if (res['result'].status_code == 401) {
            this.errorMessage = res['result'].data;
          }
        }
      });
    }
  }
  public extValue;
  instanceUrlValue(event) {
    // console.log(event)
    var numbers = /^[a-z0-9_.]*$/;
    this.extValue = event.target.value;
    // console.log(this.extValue)
    if ( !this.extValue.match(numbers))
    {
  //  console.log(1111)
   }
  }
  updateColor(colorValue, flag) {
    // console.log(colorValue)
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
    this.valueChanged();
  }
  public themeInfo: any;
  public instanceUrl;
  getFeatures() {
    this.commonsercvie.getApi('getFeaturesList', []).then(res => {
      if (res['result'].success) {
        this.features = res['result'].data.features;
        this.themeInfo = res['result'].data.theme_info;
        this.instanceUrl = res['result'].data.url_info;
        // this.instanceUrl = res
        // console.log(this.instanceUrl)

        this.colorPicker.primary_color = this.themeInfo['primary-color']['background-color'];
        this.colorPicker.secondary_color = this.themeInfo['secondary-color']['background-color'];
        this.colorPicker.header_color = this.themeInfo['header-color']['background-color'];
        this.colorPicker.footer_color = this.themeInfo['footer-color']['background-color'];
        this.colorPicker.body_color = this.themeInfo['body-color']['background-color'];

        // this.colorPicker['btn_bgColor'] = this.themeInfo['btn_bgColor']['background-color'];
        // this.colorPicker['btn_hoverColor'] = this.themeInfo['btn_hoverColor']['background-color'];
        // this.colorPicker['btn_textColor'] = this.themeInfo['btn_textColor']['background-color'];
        // this.colorPicker['secBtn_bgColor'] = this.themeInfo['secBtn_bgColor']['background-color'];
        // this.colorPicker['secBtn_textColor'] = this.themeInfo['secBtn_textColor']['background-color'];

        // this.colorPicker['secBtn_hoverColor'] = this.themeInfo['secBtn_hoverColor']['background-color'];
        // this.colorPicker['textBtn_hoverColor'] = this.themeInfo['textBtn_hoverColor']['background-color'];
        // this.colorPicker['textBtn_textColor'] = this.themeInfo['textBtn_textColor']['background-color'];
        // this..font_style = this.themeInfo['font-family']['font-family'];
        // let value;
        
      let indx =  _.findIndex(this.families, {
          name:  this.themeInfo['font-family']['font-family']
        })
        if(indx > -1) {
         var value = this.families[indx].id;
        }
        this.secondFormGroup.patchValue({
          font_style: value
        })
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
}
