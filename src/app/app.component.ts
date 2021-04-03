import { Component, Input } from '@angular/core';
import { CommonService } from './common/common.service';


var APP = window['appSettings'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public toggleClass = false;
  public showSpinner:boolean=false;
  title = 'web';
  APP = APP;
  showToggle: boolean = false;
  constructor(private _commonService: CommonService) {
    this._commonService.onUpdate().subscribe(ev => {
      // if (ev.type == 'toogle-action') {
      //   this.toggleMenu();
      // }
    })
  }
  logout() {
    window.location.href = APP.app_url + '/logout';
  }
  headerOpen($event) {
    this.toggleClass = $event;
  }
 
}
