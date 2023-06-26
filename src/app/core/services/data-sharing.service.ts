import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private dataSubject = new Subject<any>();

  public sendData(data: any): void {
    this.dataSubject.next(data);
  }

  public getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }

  public unsubscribeData(subscription: Subscription): void {
    subscription.unsubscribe();
  }
}
