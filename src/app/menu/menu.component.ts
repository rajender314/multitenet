import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/common/common.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private _commonService: CommonService) { }
  public selected_tab: string = "instances";
  public instancesCount: number = 0;
  public usersCount: number = 0;
  public isCountsLoading: boolean = true;
  ngOnInit() {
    this.getCounts();
  }
  selectedTab() {
    this._commonService.update({ type: 'toogle-action' });
  }
  getCounts() {
    this._commonService.getApi('getCounts', []).then(res => {
      if (res['result'].success) {
        this.isCountsLoading = false;
        this.instancesCount = res['result'].data.instances;
        this.usersCount = res['result'].data.users;
      }
    });
  }
} 
