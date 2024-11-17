import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActionSheetButton } from "@ionic/angular";
import { AuthService } from "@shared/services/auth.service";
import { DatabaseService } from "@shared/services/database.service";

@Component({
  selector: ".home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  items!: any[];
  isActionSheetOpen = false;
  actionSheetButtons: ActionSheetButton[] = [];

  constructor(
    private router: Router,
    private _auth: AuthService,
    private db: DatabaseService
  ) {}

  ngOnInit() {
    this._auth.currentUser.subscribe(async (res: any) => {
      this.db.getData(res.uid).subscribe((data: any) => {
        this.items = Object.entries(data).map(([id, value]) => ({
          id,
          data: value,
        }));
      });
    });
  }

  removeItem(id: string) {
    this._auth.currentUser.subscribe(async (res: any) => {
      this.db.deleteData(`${res.uid}/${id}`);
    });
  }

  setOpen(isOpen: boolean, item?: any) {
    if (item) {
      this.actionSheetButtons = [
        ...(item.data.location
          ? [
              {
                text: "Ver en Maps",
                icon: "navigate-outline",
                handler: async () => {
                  const url = `https://www.google.com/maps?q=${item.data.location.latitude},${item.data.location.longitude}`;
                  window.open(url, "_system");
                },
              },
            ]
          : []),
        {
          text: "Editar",
          icon: "create-outline",
          handler: () => {
            localStorage.setItem("eventItem", JSON.stringify(item));
            this.router.navigate(["/main/event"], {
              state: { fromHome: true },
            });
          },
        },
      ];
    }
    this.isActionSheetOpen = isOpen;
  }
}
