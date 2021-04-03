import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.scss']
})
export class ShowMessageComponent implements OnInit {
  public message: string = '';
  constructor(private dialogRef: MatDialogRef<ShowMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.message = this.data.params.message;
  }
  closeDialog() {
    this.dialogRef.close({ success: false });
  }
}
