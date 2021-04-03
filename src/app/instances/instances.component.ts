import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/common/common.service';
import { Router } from '@angular/router';
import { AddinstanceComponent } from '../dialogs/addinstance/addinstance.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SnackbarComponent } from '@app/shared/snackbar/snackbar.component';
var APP = window['appSettings'];
@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss']
})
export class InstancesComponent implements OnInit {
  instancesList: any;
  recentInstances: any;
  public rowData: any;
  defaultColDef: any;
  rowDataClicked: any;
  columnDefs: any;
  getRowHeight: any;
  public isLoading: boolean = true;
  search: string = null;
  public appurl;
  public subscriptionsList: any;
  params = {
    flag: 'dashboard',
    search: '',
    sort: 'ASC',
    statusVal: 0
  }
  public databases: any;
  public suppressRowClick = false
  rowSelection: any;
  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }
  ngOnInit() {
    this.getDatabases();
    this.getInstances();
    this.rowSelection = "single";
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      tooltip: (params) => params.value
    };
    this.appurl = window['appSettings'].app_url;
    this.columnDefs = [
      {
        headerName: 'Instance Name', editable: false, field: 'name', width: 380, cellRenderer: (params) => {
          return params.data.instancelogoUrl ?
            `<div class="instance-info name-row"> 
            <span class="image-block"><div class="instance-image"><img src='` + params.data.instancelogoUrl + `' alt="Instance Logo"/></div></span>
            <span class="instance-name">`+ params.data.name + `</span> 
          </div>`
            : `<div class="instance-info name-row"> 
            <span class="image-block"><pi-icon background="#3DC4A6" class="lg square"><i class="product-icon icon-instances"></i></pi-icon></span>
            <span class="instance-name">`+ params.data.name + `</span> 
          </div>`
        }
      },
      {
        headerName: 'DB Error', editable: false, field: 'db_error', width: 150, cellRenderer: (params) => {
          return params.value ? params.value : '--'
        }
      },
      {
        headerName: 'ENV Error', editable: false, field: 'env_error', width: 150, cellRenderer: (params) => {
          return params.value ? params.value : '--'
        }
      },
      {
        headerName: 'Created By', editable: false, field: 'updated_at', width: 250, cellRenderer: (params) => {
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
      // {
      //   headerName: 'Delete', editable: false, field: 'delete_status', width: 200, cellRenderer: (params) => {
       
      //   return  `<div class="instance-info name-row"> 
      //    <pi-icon background="#3DC4A6" class="lg square"><i class="product-icon icon-delete"></i></pi-icon>
         
      //   </div>`

            
      //   }
      // }
    ];
    this.getRowHeight = function (params) {
      return 60;
    };
  }
  public noDataFound = false;
  getInstances(fromFilter = false) {
    this.isLoading = true;
    this._commonService.getApi('getInstances', this.params).then(res => {
      if (res['result'].success) {
        this.instancesList = res['result'].data.instances;
        if( this.instancesList.length) {
          this.noDataFound = false;
        } else {
          this.noDataFound = true;

        }
        this.subscriptionsList = res['result'].data.subscriptions;
        this.isLoading = false;
      }
    });
  }
  onRowSelected(event) {
   
   this._commonService.instanceId =  event.data.id;
   console.log(this._commonService.instanceId )
    this._router.navigate(['/instances', event.data.id]);
  }

  onCellClicked(param) {
    console.log(param)
  }
  addInstance() {
    this._dialog.open(AddinstanceComponent, {
      panelClass: 'full-view-dialog',
      height: '750px',
      width: '600px',
      data: {
        title: 'Add Instance',
        params: { 'databases': this.databases, 'subscriptions': this.subscriptionsList },
        action: 'saveInstance',
        url: 'saveInstance',
        content: 'Are you sure want to Add'
      }
    })
      .afterClosed()
      .subscribe(response => {
        if (response && response.success) {
          this.getInstances();
          this.snackbar.openFromComponent(SnackbarComponent, {
            data: { status: 'success', msg: 'Instance added successfully' },
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      })
  }
  searchInstance(search) {
    this.params.search = search;
    this.getInstances();
  }
  clearSearch() {
    this.params.search = '';
    this.search = '';
    this.getInstances();
  }
  getDatabases() {
    this._commonService.getApi('getDatabasesList', []).then(res => {
      if (res['result'].success) {
        this.databases = res['result'].data.list;
      }
    });
  }
}

