import { Injectable, Type } from "@angular/core";
import { ModalController, ModalOptions } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async create<T>(component: Type<T>): Promise<HTMLIonModalElement> {
    const modalOptions: ModalOptions = {
      component,
    };

    const modal = await this.modalController.create(modalOptions);
    await modal.present();
    return modal;
  }

  async dismiss(data?: any): Promise<void> {
    await this.modalController.dismiss(data);
  }
}
