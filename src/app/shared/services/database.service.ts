import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  saveData(path: string, data: any): Promise<void> {
    return this.db.object(path).set(data);
  }

  getData(path: string): Observable<any> {
    return this.db.object(path).valueChanges();
  }

  addToList(path: string, data: any): any {
    return this.db.list(path).push(data);
  }

  deleteData(path: string): Promise<void> {
    return this.db.object(path).remove();
  }
}
