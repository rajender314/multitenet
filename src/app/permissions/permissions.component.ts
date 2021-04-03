import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import * as _ from "lodash";
import { CommonService } from '@app/common/common.service';
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  @Input() permission;
  @Output('emitPermissionData') emitPermissionData = new EventEmitter<any>();

  constructor(
   
    private commonsercvie: CommonService
  ) {
  }

  ngOnInit() {

  }
  ngOnChanges() {
  }

  // permissionData() {
  //   console.log('permissionData')
  //   this.emitPermissionData.emit(this.dataFromPermission);
  // }

  public dataFromPermission;
  check(item, option): void {
    console.log(item, option)
    this.dataFromPermission = true;

    this.emitPermissionData.emit(this.dataFromPermission);
    if (item.type === 'check') {
      item.permission = _.indexOf(item.permission, 1) > -1 ? [] : [1];
      item.checked = _.indexOf(item.permission, 1) > -1 ? true : false;
    } else if (item.type === 'select' || item.type === 'radio') {
      item.permission = [option];
      item.selectedValue = option;
    }
    if (item.children) {
      this.checkChild(item.children, item);
    }
    this.commonsercvie.enableSubBtn = true;

    
  }

  permissionData($event){
    this.emitPermissionData.emit(true);
  }

  checkChild(data, parent): void {
    data.map(child => {
      if (parent.type === 'check') {
        console.log('ceee')
        child.checked = parent.checked;
        child.selectedValue = parent.checked === true ? 1 : 3;
        child.permission = parent.checked === true ? [1] : [];
      } else if (parent.type === 'select' || parent.type === 'radio') {
        child.checked = parent.selectedValue === 1 ? true : false;
        child.selectedValue = parent.selectedValue;
        child.permission = parent.selectedValue === 3 ? [3] : [1];
      }
      if (data.children) {
        this.checkChild(child.children, child);
      }
    })
  }


}
