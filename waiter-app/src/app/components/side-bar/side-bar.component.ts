import { Component, inject } from '@angular/core';
import { NavigationService, ViewType } from '../../services/navigation.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  private navigationService = inject(NavigationService)
  view = this.navigationService.currentView;

  setView(view: ViewType): void {
    this.navigationService.setView(view)
    this.view = view
  }
}
