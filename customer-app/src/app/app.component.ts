import { Component } from "@angular/core";
import { HeaderComponent } from "./components/header/header.component";
import { TableDetails } from "./components/table-details/table-details.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, TableDetails],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  
}