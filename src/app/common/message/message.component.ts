import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ASSETS, Strings } from 'src/app/utils/resources';

@Component({
    selector: 'message-component',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    standalone: true
})
export class MessageComponent implements OnInit {
  title: string;
  message: string;
  showIcon: string;

  constructor(
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;
    this.showIcon = this.data.showIcon;
    document.getElementById('imgIcon').setAttribute('src', this.showIcon);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close({});
  }
}
