import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common/common.service';
@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent implements OnInit {
  data: any;
  params: any;
  constructor(private _commonService: CommonService) { }
  ngOnInit() {
  }
  agInit(params) {
    this.params = params;
  }
  sendMail() {
    this._commonService.saveApi('resend', this.params.data).then(res => {
      this._commonService.update({ type: 'email-controllers' });
    });
  }
}