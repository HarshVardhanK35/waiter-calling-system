import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ViewType = 'DASHBOARD' | 'ACTIVE_TABLES';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private viewSubject = new BehaviorSubject<ViewType>('DASHBOARD');

  view$ = this.viewSubject.asObservable();

  setView(view: ViewType): void {
    this.viewSubject.next(view);
  }

  get currentView(): ViewType {
    return this.viewSubject.value;
  }
}
