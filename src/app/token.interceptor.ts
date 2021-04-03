import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
// import { MatDialog } from '@angular/material';
import { JsonPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from './dialogs/confirmdialog/confirmdialog.component';

var APP: any = window['appSettings'];

// import { SessionRestoreComponent } from '@app/dialogs/session-restore/session-restore.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  counter: number = 0;
  checkSum: any = {};
  dt = new Date();
  APP=APP;
  public dialogShow = true;
  returnUrl = APP.app_url + 'logout';


  constructor(
    
    private dialog: MatDialog
  ) { }
  

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let key = '';
    if (request.method == 'GET') {
      key = request.url.split('/').pop();
      if (!this.checkSum[key]) this.checkSum[key] = {};
    }
    request = request.clone({
      setHeaders: {
        'X-Jwt-Token': APP.user.token,
        'access_id': APP.user.access_id
      },
      setParams: {
        'time_zone': String(this.dt.getTimezoneOffset())
      }
    });
    return next.handle(request)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            if (event.body.hasOwnProperty('status_code') && event.body.status_code == 401) {
              // if (this.counter == 0)
              //   // this.sessionDestroy(401);
              //   this.counter++;

              if(this.dialogShow) {
                // console.log(2222)
                this.dialogShow = false;
                let dialogRef = this.dialog.open(ConfirmdialogComponent, {
                  panelClass: 'alert-dialog',
                  disableClose: true,
                  width: '600px',
                  data: {
                    title: 'Session Expired',
                    
                    content: 'Your session has expired due to inactivity. Please log back in to continue...'
                  }
                });
                dialogRef.afterClosed().subscribe(result => {
                  // console.log(result)
                  if (result.success) {
                    location.href = this.returnUrl;
                  }

                 
                });
              
              }
              setTimeout(() => {
                location.href = this.returnUrl;
              }, 2000);
            } else if (event.body.hasOwnProperty('status_code') && event.body.status_code == 502) {
              if (this.counter == 0)
                // this.sessionDestroy(502);
                // console.log(222)
                this.counter++;
            }
            else {
              // console.log(2525)
              if (request.method == 'GET') {
                this.checkSum[key].rapidium_act = event.body.result.rapidium_act;
                this.checkSum[key].rapidium_checksum = event.body.result.rapidium_checksum;
              }
            }
          }
        })/*,
      takeUntil(this.httpCancelService.onCancelPendingRequests())*/
      )
  }

  // sessionDestroy(type) {
  //   this.dialog.open(SessionRestoreComponent, {
  //     panelClass: 'my-dialog',
  //     width: '600px',
  //     disableClose: true,
  //     data: { 
  //       type: type
  //     } 
  //   })
  //   .afterClosed()
  //   .subscribe(res => {
  //     this.counter = 0;
  //   })
  // }
}