import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
// import { AuthenticationService } from '@app/_authentication/authentication.service';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { CommonService } from '@app/common/common.service';
import { Title } from '@angular/platform-browser';
const clientMenu = [
  {
    header: '',
    children: [
      {
        name: 'Users Management',
        href: '/users',
        icon: 'icon-users',
        id: 'users',
        matchUrls: [],
        children: []
      },
      {
        name: 'Users Roles',
        href: '/userroles',
        icon: 'icon-users',
        id: 'userroles',
        matchUrls: [],
        children: []
      }

    ]
  }
];

const mainMenu = [
  {
    header: '',
    children: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        isShow: true,
        icon: 'icon-dashboard',
        id: 'gallery',
        matchUrls: [],
        children: []
      },
      {
        name: 'Instances',
        href: '/instances',
        isShow: true,
        icon: 'icon-instances',
        id: 'instances',
        matchUrls: [],
        children: []
      },
      {
        name: 'Subscriptions',
        href: '/subscriptions',
        isShow:  true,
        icon: 'icon-setting',
        id: 'settings',
        matchUrls: [],
        children: []
      },
      {
        name: 'Users',
        href: '/users',
        isShow: (window['appSettings'].user.user_type == 1) ? true : false,
        icon: 'icon-users',
        id: 'users',
        matchUrls: [],
        children: []
      },
      {
        name: 'Super Admin',
        href: '/superadmin/settings',
        isShow: (window['appSettings'].user.user_type == 1) ? true : false,
        icon: 'icon-setting',
        id: 'settings',
        matchUrls: [],
        children: []
      }

    ]
  }
];
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('0.15s ease', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('0.30s ease', style({ opacity: 0 }))])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @Output('onheaderOpen') openEvent: EventEmitter<any> = new EventEmitter();
  public showUserHeader: boolean;
  public showGalleryHeader: boolean;
  public showMainHeader: boolean = false;
  public showChild: boolean;
  public tabs = [];
  public mainMenuTabs = [];
  public assetsPath;
  public baseurl;
  public appurl;
  public childMenu: any;
  public userType: any = 1;
  public instancesCount: number = 0;
  public usersCount: number = 0;
  public isCountsLoading: boolean = true;
  public userName = '';
  constructor(
    public router: Router,
    public _commonService: CommonService,
    private titleService: Title
    // private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.assetsPath = environment.assetsPath;
    this.baseurl = window['appSettings'].base_url;
    this.appurl = window['appSettings'].app_url;
    this.tabs = clientMenu;
    this.userType = window['appSettings'].user.user_type;
    this.userName = window['appSettings'].user.name;
    this.mainMenuTabs = mainMenu;
    console.log(this._commonService.headerShow)
    console.log(environment);
  } 

  logout() {
    console.log(this.appurl + 'logout');
  }

  manageAccount() {
    this.router.navigate(['/userprofile']);
  }

  toggleUserSidebar() {
    this.showUserHeader = !this.showUserHeader;
    this.showGalleryHeader = false;
    this.openEvent.emit(this.showUserHeader);
  }

  toggleGallerySidebar() {
    this.showGalleryHeader = !this.showGalleryHeader;
    this.showUserHeader = false;
    this.showMainHeader = false;
    this.openEvent.emit(this.showGalleryHeader);
  }
  public setTitle(newTitle: string) { 
    this.titleService.setTitle(newTitle);
  }
  openLink(tab: any, event) {
    let path = tab['href'];
    // if (tab.id == 'settings') {
    //   window.open(path, '_blank');
    // } else {
    const openInwindow = event ? event.ctrlKey : false
    if (openInwindow) {
      window.open("/#/" + path, '_blank');
    } else {
      this.router.navigateByUrl(path);
    }
    // }
    this.showUserHeader = false;
    this.showMainHeader = false;
    this.showChild = false;
  }

  toggleMainSidebar() {
    if (!this.showMainHeader) {
      this.getCounts();
    }
    this.showMainHeader = !this.showMainHeader;
    this.showUserHeader = false;
    this.showGalleryHeader = false;
    this.openEvent.emit(this.showMainHeader);
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

  openChildMenu(tab) {
    if (tab && tab['children'].length) {
      this.childMenu = tab;
      this.showChild = !this.showChild;
    }
  }

  backToParent() {
    this.showChild = !this.showChild;
  }
}
