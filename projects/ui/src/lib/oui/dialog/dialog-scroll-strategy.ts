import { Injectable } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { OverlayReference } from '@angular/cdk/overlay/typings/overlay-reference';

/** Scroll strategy that scrolls only overflowed dialog (prevent inner scroll) */
@Injectable()
export class DialogScrollStrategy implements ScrollStrategy {
  private _document: Document;
  private _overlayRef: OverlayReference;
  private _previousBodyOverflow: string;

  constructor() {
    this._document = document;
  }
  /** Attaches this scroll strategy to an overlay. */
  attach(overlayRef: OverlayReference) {
    this._overlayRef = overlayRef;
  }
  /** scroll only dialog overlay */
  enable() {
    this._setOverlayStyle();
    const body = this._document.body;
    this._previousBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }

  disable() {
    const body = this._document.body;
    body.style.overflow = this._previousBodyOverflow;
  }

  private _setOverlayStyle() {
    this._overlayRef.hostElement.style.pointerEvents = 'auto';
    this._overlayRef.hostElement.style.position = 'fixed';
    this._overlayRef.hostElement.style.overflow = 'auto';
    this._overlayRef.overlayElement.style.paddingTop = '40px';
    this._overlayRef.overlayElement.style.marginBottom = '40px';
    this._overlayRef.hostElement.style.zIndex = '100';
  }
}
