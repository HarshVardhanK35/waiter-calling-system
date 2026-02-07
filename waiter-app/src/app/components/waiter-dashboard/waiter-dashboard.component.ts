import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ActiveCallsComponent } from "../active-calls/active-calls.component";

@Component({
  selector: 'app-waiter-dashboard',
  standalone: true,
  imports: [HeaderComponent, ActiveCallsComponent],
  templateUrl: './waiter-dashboard.component.html',
  styleUrl: './waiter-dashboard.component.css'
})
export class WaiterDashboardComponent { }
