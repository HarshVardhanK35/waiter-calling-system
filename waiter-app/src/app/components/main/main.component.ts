import { Component, inject } from '@angular/core';
import { TablesComponent } from './tables/tables.component';
import { NavigationService } from '../../services/navigation.service';
import { AsyncPipe } from '@angular/common';
import { ActiveTablesComponent } from "./active-tables/active-tables.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [TablesComponent, AsyncPipe, ActiveTablesComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private navigationService = inject(NavigationService)
  view$ = this.navigationService.view$
}
