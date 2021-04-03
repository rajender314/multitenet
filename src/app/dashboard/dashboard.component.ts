import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/common.service';
import { Router } from "@angular/router";
import { Title }  from '@angular/platform-browser';
var APP = window['appSettings'];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  instancesList: any;
  APP = APP;
  recentInstances: any;
  public rowData: any;
  defaultColDef: any;
  rowDataClicked: any;
  columnDefs: any;
  getRowHeight: any;
  public appurl;
  params = {
    flag: 'dashboard'
  }
  public userType: any = 1;
  rowSelection: any;
  constructor(private _commonService: CommonService, private _router: Router,private titleService: Title) { }
  ngOnInit() {
    this.userType = window['appSettings'].user.user_type;
    this.getInstances();
    //console.log(this.recentInstances)
    this.rowSelection = "single";
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      // rowSelection: 'single',
      tooltip: (params) => params.value
    };
    this.appurl = window['appSettings'].app_url;
    this.columnDefs = [
      {
        headerName: 'Instance Name', editable: false, field: 'name', width: 380, cellRenderer: (params) => {
          return params.data.instancelogoUrl ?
            `<div class="instance-info name-row"> 
            <span class="image-block"><div class="instance-image"><img src='` + params.data.instancelogoUrl + `' alt="Instance Logo"/></div></span>
            <span>`+ params.data.name + `</span> 
          </div>`
            : `<div class="instance-info name-row"> 
            <span class="image-block"><pi-icon background="#3DC4A6" class="lg square"><i class="product-icon icon-instances"></i></pi-icon></span>
            <span>`+ params.data.name + `</span> 
          </div>`
         
        }
      },
      {
        headerName: 'DB Error', editable: false, field: 'db_error', width: 200, cellRenderer: (params) => {
          return params.value ? params.value : '--'
        }
      },
      {
        headerName: 'ENV Error', editable: false, field: 'env_error', width: 200, cellRenderer: (params) => {
          return params.value ? params.value : '--'
        }
      },
      {
        headerName: 'Last Modified', editable: false, field: 'updated_at', width: 300, cellRenderer: (params) => {
          return params.value ?
            `<div class="instance-info">         
          <span>`+ params.data.updated_by + `</span>
          <span>`+ params.value + `</span>
        </div>`
            : ''
        }
      },
      {
        headerName: 'Status', editable: false, field: 'status_name', width: 200, cellRenderer: (params) => {
          return params.value ?
            `<div class="job_status active">` + params.value + `</div>`

            : ''
        }
      },
      // this.rowSelection = "single"
    ];
    this.getRowHeight = function (params) {
      return 60;
    };

  }
  displayDefaultImage(e) {
    e.target.src = this.appurl + 'public/images/instance.jpg';
  }
  getInstances() {
    this._commonService.getApi('getInstances', this.params).then(res => {
      if (res['result'] && res['result'].success) {
        this.rowData = res['result'].data.instances;
        this.recentInstances = res['result'].data.recentInstances;
        if(this.userType == 2) {
          window.location.href =  this.recentInstances[0]['url'];
        }
      }
    });
  }
  onRowSelected(event) {
    this._router.navigate(['/instances', event.data.id]);
  }
}
