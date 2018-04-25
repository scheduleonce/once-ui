import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.css']
})
export class InfoPopupComponent implements OnInit {
  @Input() titleMsg: string;
  @Input() confirmMsg: string;
  @Input() type: string;
  @Input() promoBtnValue: string = null;
  confirmYesFunc: Function;
  confirmNoFunc: Function;
  promotionFunc: Function;
  _ref: any;
  popupNumber: number = null;
  leftButtonText = 'No thanks';

  constructor() {}

  ngOnInit() {
    if (this.type === 'confirm-box') {
      this.popupNumber = 1;
    } else if (this.type === 'alert-box') {
      this.popupNumber = 2;
    } else if (this.type === 'promotion-box') {
      this.popupNumber = 3;
    }
  }

  close() {
    this._ref.destroy();
  }
}
