import { Injectable } from "@angular/core";
import { DUMMY_TABLES } from "../data/dummy-tables.data";

@Injectable({
  providedIn: "root"
})
export class TableData {
  tables = DUMMY_TABLES
}