import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControlDirective, FormControl } from '@angular/forms';
import { CommonService } from 'app/common/common.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  title = 'Features List';
  features: any;
  isLinear = false;
  featuresForm = new FormGroup({});
  selectedFeatures: any;
  constructor(private _formBuilder: FormBuilder, private commonService: CommonService) {
    this.selectedFeatures = {
      application_login: "no", application_self_login: "no", campaigns: "yes", child1: "yes", child2: "no", client_custum_azure_login: "yes", creative_deliverables: "no", distribution_list: "no", estimates_from_recon: "yes", files_and_briefs: "yes", ftp_host: "1221", ftp_password: "21221", ftp_port: "21212121", ftp_username: "2121211", ivie_sso: "no", job_estimates: "yes", jobs: "yes", management_user_login: "yes", orders: "no",
      orders_form_and_statuses: "no", orders_tracking: "yes", products_services_specs: "yes", recon_sync: "yes", skl: "yes", vendor_estimates: "no", vendor_list_from_recon: "no"
    };
    this.features = [
      {
        id: 1, name: 'Login',
        childList: [
          {
            id: 1, parent_id: 1, code: 'client_custum_azure_login', name: 'Client Custum Azure Login', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 2, parent_id: 1, code: 'ivie_sso', name: 'IVIE SSO', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 3, parent_id: 1, code: 'management_user_login', name: 'Management User Login', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 4, parent_id: 1, code: 'application_login', name: 'Application Self Login', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          }
        ]
      },
      {
        id: 2, name: 'Compaigns', childList: [
          {
            id: 1, parent_id: 2, code: 'campaigns', name: 'Campaigns', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 2, parent_id: 2, code: 'jobs', name: 'Jobs', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 3, parent_id: 2, code: 'orders', name: 'Orders', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 4, parent_id: 2, code: 'orders_form_and_statuses', name: 'Orders Form and Statuses', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 5, parent_id: 2, code: 'orders_tracking', name: 'Orders Tracking', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 6, parent_id: 2, code: 'skl', name: 'SKL', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 7, parent_id: 2, code: 'creative_deliverables', name: 'Creative Deliverables', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 8, parent_id: 2, code: 'vendor_estimates', name: 'Vendor Estimates', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 9, parent_id: 2, code: 'job_estimates', name: 'Job Estimates', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 10, parent_id: 2, code: 'files_and_briefs', name: 'Files And Briefs', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          }
        ]
      },
      {
        id: 3, name: 'Recon Integration',
        childList: [
          {
            id: 1, parent_id: 3, code: 'recon_sync', name: 'Recon Sync', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 2, parent_id: 3, code: 'distribution_list', name: 'Distribution List', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 3, parent_id: 3, code: 'estimates_from_recon', name: 'Estimates From Recon', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 4, parent_id: 3, code: 'application_self_login', name: 'Application Self Login', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 5, parent_id: 3, code: 'products_services_specs', name: 'Products,Services and Specs', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 6, parent_id: 3, code: 'vendor_list_from_recon', name: 'Vendor List From Recon', type: "radio", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          }
        ]
      },
      {
        id: 4, name: 'Ads',
        childList: [
          {
            id: 1, parent_id: 4, code: 'child1', name: 'child 1', isSelected: true, type: "select", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          },
          {
            id: 2, parent_id: 4, code: 'child2', name: 'child 2', type: "select", options: [{ label: "YES", value: "yes" }, { label: "NO", value: "no" }]
          }
        ]
      },
      {
        id: 5, name: 'FTP',
        childList: [
          {
            id: 1, parent_id: 5, code: 'ftp_host', name: 'FTP HOST', isSelected: true, type: "text", value: ''
          },
          {
            id: 2, parent_id: 5, code: 'ftp_username', name: 'FTP Username', type: "text", value: ''
          },
          {
            id: 3, parent_id: 5, code: 'ftp_password', name: 'FTP Password', type: "text", value: ''
          },
          {
            id: 4, parent_id: 5, code: 'ftp_port', name: 'FTP Port', type: "text", value: ''
          }
        ]
      }
    ];
  }



  ngOnInit() {
    this.getFeatures();
    this.features.map(row => {
      // this.featuresForm.addControl(row.id, new FormControl());
      row.childList.map(child => {
        // console.log(this.selectedFeatures[child.id]);
        this.featuresForm.addControl(child.code, new FormControl(this.selectedFeatures[child.code]));
      })
    })
    // console.log(this.featuresForm.value)

  }
  saveFormInfo() {
    console.log(this.featuresForm.value);
  }
  getFeatures() {
    this.commonService.getApi('getFeaturesList', []).then(res => {
      if (res['result'].success) {
        // this.features = res['result'].data.features;
        // console.log(this.features);
      }
    }); 
  }
}
