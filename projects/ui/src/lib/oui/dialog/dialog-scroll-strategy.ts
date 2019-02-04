import { Injectable } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { OverlayReference } from '@angular/cdk/overlay/typings/overlay-reference';
import { Observable, fromEvent, Subscription } from 'rxjs';

/** Scroll strategy that doesn't do anything. */
@Injectable()
export class DialogScrollStrategy implements ScrollStrategy {
  private _document: Document;
  private _overlayRef: OverlayReference;
  private _previousBodyOverflow: string;
  private _scrollBodyEvent: Observable<any>;
  private _subscription: Subscription;

  constructor() {
    this._document = document;
    this._scrollBodyEvent = fromEvent(document.body, 'wheel');
  }
  /** Attaches this scroll strategy to an overlay. */
  attach(overlayRef: OverlayReference) {
    this._overlayRef = overlayRef;
  }
  /** scroll only dialog overlay */
  enable() {
    const body = this._document.body;
    this._previousBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    this._overlayRef.hostElement.style.position = 'fixed';
    this._overlayRef.hostElement.style.overflow = 'auto';
    this._subscription = this._scrollBodyEvent.subscribe(
      (event: WheelEvent) => {
        console.log(event);
        let scrollTop = this._overlayRef.hostElement.scrollTop;
        this._overlayRef.hostElement.scrollTop = scrollTop + event.deltaY;
        event.stopPropagation();
      }
    );
  }

  disable() {
    const body = this._document.body;
    body.style.overflow = this._previousBodyOverflow;
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
