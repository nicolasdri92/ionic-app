import { Component } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ModalService } from "@shared/services/modal.service";
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { DatabaseService } from "@shared/services/database.service";
import { ToastController } from "@ionic/angular";
import { AuthService } from "@shared/services/auth.service";

@Component({
  selector: ".event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent {
  eventForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    datetime: new FormControl(new Date().toISOString(), Validators.required),
    location: new FormControl(""),
    description: new FormControl(""),
  });
  userId: any;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private _modal: ModalService,
    private _auth: AuthService,
    private _db: DatabaseService
  ) {}

  ionViewWillEnter(): void {
    const item = localStorage.getItem("eventItem");
    if (item) {
      const JSONParseItem = JSON.parse(item);
      this.loadItemData(JSONParseItem);
      this.userId = JSONParseItem.id;
      localStorage.removeItem("eventItem");
    } else {
      this.eventForm.reset({
        name: "",
        datetime: new Date().toISOString(),
        location: "",
        description: "",
      });
    }
  }

  ionViewWillLeave() {

    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }

  }

  loadItemData(item: any): void {
    this.eventForm.setValue({
      name: item.data.name || "",
      datetime: item.data.datetime || new Date().toISOString(),
      location: item.data.location || "",
      description: item.data.description || "",
    });
  }

  async onSubmit(): Promise<void> {
    this._auth.currentUser.subscribe(async (res: any) => {
      if (this.userId) {
        await this._db
          .saveData(`${res.uid}/${this.userId}`, this.eventForm.value)
          .then(async () => {
            this.name?.setValue("");
            this.datetime?.setValue(new Date().toISOString());
            this.location?.setValue("");
            this.description?.setValue("");
            this.userId = null;
            this.router.navigate(["/main/home"]);
          })
          .catch(async () => {
            await this.presentToast("Error al guardar el evento", "danger");
          });
      } else {
        await this._db
          .addToList(res.uid, this.eventForm.value)
          .then(async () => {
            this.name?.setValue("");
            this.datetime?.setValue(new Date().toISOString());
            this.location?.setValue("");
            this.description?.setValue("");
            this.router.navigate(["/main/home"]);
          })
          .catch(async () => {
            await this.presentToast("Error al guardar el evento", "danger");
          });
      }
    });
  }

  async openModal(): Promise<void> {
    const modal = await this._modal.create(GoogleMapsComponent);
    const { data } = await modal.onWillDismiss();

    this.location?.setValue(data);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      buttons: [{ role: "cancel", text: "OK" }],
    });
    await toast.present();
  }

  get name(): AbstractControl<any, any> | null {
    return this.eventForm.get("name");
  }

  get datetime(): AbstractControl<any, any> | null {
    return this.eventForm.get("datetime");
  }

  get location(): AbstractControl<any, any> | null {
    return this.eventForm.get("location");
  }

  get description(): AbstractControl<any, any> | null {
    return this.eventForm.get("description");
  }
}
