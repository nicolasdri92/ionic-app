import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AuthService } from '@shared/services/auth.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {firebase} from 'firebase/compat/app'; // Asegúrate de importar firebase aquí

interface UserPreferences {
  language?: string;
  theme?: string;
}

@Component({
  selector: '.profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: firebase.User | null = null;
  uploadedFileURL: string = '';
  isDarkMode: boolean = false;
  selectedLanguage: string = 'en';

  constructor(
    private router: Router,
    private _modal: ModalService,
    private _auth: AuthService,
    private storage: AngularFireStorage,
    private _toast: ToastService,
    private translate: TranslateService,
    private firestore: AngularFirestore
  ) {
    this.translate.setDefaultLang('en');
  }

  async ngOnInit(): Promise<void> {
    this.loadUserPreferences();
    this.ionViewWillEnter();
  }

  private async loadUserPreferences(): Promise<void> {
    const user = await this._auth.currentUser.toPromise();
    if (user && user instanceof firebase.User)) {
      const preferencesRef = this.firestore.collection('preferences').doc(user.email || ''); // Usando email como identificador
      preferencesRef
        .get()
        .toPromise()
        .then((doc) => {
          if (doc?.exists) {
            const preferences = doc.data() as UserPreferences;
  
            if (preferences.language) {
              this.selectedLanguage = preferences.language;
              this.translate.use(preferences.language);
            }
  
            if (preferences.theme) {
              this.setTheme(preferences.theme);
            }
          }
        });
    }
  }
  

  ionViewWillEnter(): void {
    this._auth.currentUser.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.getFileURL();
      }
    });
  }

  private getFileURL(): void {
    if (!this.currentUser) return;

    const filePath = `uploads/${this.currentUser.uid}`;
    const task = this.storage.ref(filePath);

    task.getDownloadURL().subscribe({
      next: (res) => (this.uploadedFileURL = res),
      error: () =>
        (this.uploadedFileURL =
          'https://firebasestorage.googleapis.com/v0/b/event-ionic-app-99c14.appspot.com/o/uploads%2Fdefault.png?alt=media'),
    });
  }

  async openModal(): Promise<void> {
    const modal = await this._modal.create(ModalComponent);
    const { data } = await modal.onWillDismiss();
    if (data && this.currentUser) {
      await this.currentUser.updateProfile({ displayName: data.name });
    }
  }

  // Métodos solicitados
  setTheme(theme: string): void {
    this.isDarkMode = theme === 'dark';
    document.body.classList.toggle('dark', this.isDarkMode);
    document.body.classList.toggle('light', !this.isDarkMode);
    this.saveUserPreferences();
  }

  uploadFile(event: any): void {
    if (!this.currentUser) return;

    const file = event.target.files[0];
    if (file) {
      const filePath = `uploads/${this.currentUser.uid}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task
        .snapshotChanges()
        .pipe(finalize(() => fileRef.getDownloadURL().subscribe((url) => (this.uploadedFileURL = url))))
        .subscribe();
    }
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    this.translate.use(language);
    this.saveUserPreferences();
  }

  logout(): void {
    this._auth
      .logout()
      .then(() => this.router.navigate(['/auth/login']))
      .catch(async (err) => await this.presentToast(err));
  }

  private saveUserPreferences(): void {
    if (!this.currentUser) return;

    const preferences: UserPreferences = {
      language: this.selectedLanguage,
      theme: this.isDarkMode ? 'dark' : 'light',
    };

    this.firestore
      .collection('preferences')
      .doc(this.currentUser.uid)
      .set(preferences, { merge: true });
  }

  private async presentToast(message: string): Promise<void> {
    await this._toast.show(message);
  }
}

// Agregar propiedad `show` al tipo `ToastService`
declare module '@shared/services/toast.service' {
  interface ToastService {
    show(message: string): Promise<void>;
  }
}
