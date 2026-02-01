import { Component } from "@angular/core";
import { HeaderComponent } from "./components/header/header.component";
import { TableList } from "./components/table-list/table-list";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, TableList],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  
}