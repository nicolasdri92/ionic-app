import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: '.modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(private _auth: AuthService, private _modal: ModalService) {}

  modalForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this._auth.currentUser.subscribe((user: any) => {
      if (user) {
        const currentUser = user?.providerData[0];
        this.name?.setValue(currentUser?.displayName);
      }
    });
  }

  confirm(): void {
    this._modal.dismiss(this.modalForm.value);
  }

  cancel(): void {
    this._modal.dismiss();
  }

  get name(): AbstractControl<any, any> | null {
    return this.modalForm.get('name');
  }
}
