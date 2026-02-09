import { Component } from '@angular/core';

import { SideBarComponent } from "../side-bar/side-bar.component";
import { MainComponent } from "../main/main.component";

@Component({
  selector: 'app-waiter-dashboard',
  standalone: true,
  imports: [SideBarComponent, MainComponent],
  templateUrl: './waiter-dashboard.component.html',
  styleUrl: './waiter-dashboard.component.css'
})
export class WaiterDashboardComponent { }
