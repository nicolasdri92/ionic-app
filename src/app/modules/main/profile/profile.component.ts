import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ActionSheetButton } from '@ionic/angular';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AuthService } from '@shared/services/auth.service';
import { ModalService } from '@shared/services/modal.service';
import { PhotoService } from '@shared/services/photo.service';
import { ToastService } from '@shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: '.profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  currentUser: firebase.default.UserInfo | null;
  uploadedFileURL: string;
  isActionSheetOpen = false;
  actionSheetButtons: ActionSheetButton[] = [
    {
      text: 'Tomar una foto',
      icon: 'camera',
      handler: async () => {
        const file = await this._photo.addNewToGallery();
        if (file) {
          this.uploadFileToFirebase(file.webviewPath, true);
        }
      },
    },
    {
      text: 'Galeria',
      icon: 'image',
      handler: () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = 'image/*';
        inputElement.click();
        inputElement.onchange = (event: any) => this.uploadFileToFirebase(event.target.files[0], false);
      },
    },
  ];

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  constructor(
    private router: Router,
    private storage: AngularFireStorage,
    private _auth: AuthService,
    private _modal: ModalService,
    private _photo: PhotoService,
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

  uploadFileToFirebase(file: any, isBlob: boolean): void {
    if (isBlob) {
      this.uploadBlob(file);
    } else {
      this.uploadFile(file);
    }
  }

  private uploadBlob(blobData: any): void {
    if (blobData.startsWith('data:image')) {
      const blob = this.dataURItoBlob(blobData);
      this.uploadToFirebase(blob);
    } else {
      this.convertUrlToBase64(blobData).then((base64: string) => {
        const blob = this.dataURItoBlob(base64);
        this.uploadToFirebase(blob);
      }).catch((error) => {
        console.error('Error al convertir la URL a Base64', error);
      });
    }
  }

  private uploadFile(file: File): void {
    this.uploadToFirebase(file);
  }

  private uploadToFirebase(fileOrBlob: Blob | File): void {
    const filePath = `uploads/${this.currentUser?.uid}`;
    const task = this.storage.upload(filePath, fileOrBlob);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.getFileURL();
        })
      )
      .subscribe();
  }

  private convertUrlToBase64(url: string): Promise<string> {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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
