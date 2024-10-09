import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AuthService } from '@shared/services/auth.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: '.profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  currentUser: firebase.default.UserInfo | null;
  uploadedFileURL: string;

  constructor(
    private router: Router,
    private _modal: ModalService,
    private _auth: AuthService,
    private storage: AngularFireStorage,
    private _toast: ToastService
  ) {}

  ionViewWillEnter(): void {
    this._auth.currentUser.subscribe((user: any) => {
      if (user) {
        this.currentUser = user?.providerData[0];
        this.getFileURL();
      }
    });
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    const filePath = `uploads/${this.currentUser?.uid}`;
    const task = this.storage.upload(filePath, file);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.getFileURL();
        })
      )
      .subscribe();
  }

  private getFileURL(): void {
    const filePath = `uploads/${this.currentUser?.uid}`;
    const task = this.storage.ref(filePath);

    task.getDownloadURL().subscribe({
      next: (res) => {
        this.uploadedFileURL = res;
      },
      error: () => {
        this.uploadedFileURL =
          'https://firebasestorage.googleapis.com/v0/b/event-ionic-app-99c14.appspot.com/o/uploads%2Fdefault.png?alt=media';
      },
    });
  }

  logout(): void {
    this._auth
      .logout()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch(async (err: firebase.default.FirebaseError) => {
        await this.presentToast(err);
      });
  }

  private async presentToast(
    code: firebase.default.FirebaseError
  ): Promise<void> {
    let message: string = code.message;
    let icon: string = 'alert-circle-outline';
    let color: string = 'danger';

    this._toast.create(message, icon, color);
  }

  async openModal(): Promise<void> {
    const modal = await this._modal.create(ModalComponent);
    const { data } = await modal.onWillDismiss();

    if (data) {
      this._auth.currentUser.subscribe(async (user: any) => {
        if (user) {
          await user.updateProfile({ displayName: data.name });
          await this._auth.updateCurrentUser(user);
        }
      });
    }
  }
}
