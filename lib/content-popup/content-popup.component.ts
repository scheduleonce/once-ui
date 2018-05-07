import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-popup',
  templateUrl: './content-popup.component.html',
  styleUrls: ['./content-popup.component.css']
})
export class ContentPopupComponent implements OnInit {
  @Input() title: string;
  enable = false;
  _ref: any;
  constructor() {}

  ngOnInit() {}

  open() {
    this.enable = true;
    const htmlTag = document.getElementsByTagName('html')[0];
    htmlTag.classList.add('PopupOpenedwithoutscroll');
  }

  close() {
    if (this._ref) {
      this._ref.destroy();
    }
    this.enable = false;
    const htmlTag = document.getElementsByTagName('html')[0];
    htmlTag.classList.remove('PopupOpenedwithoutscroll');
  }
}
