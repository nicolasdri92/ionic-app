import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(
    private translate: TranslateService,
    private storage: Storage
  ) {
    this.init();
  }

  // Inicializar configuración de idioma y tema
  private async init() {
    await this.storage.create();
    
    // Cargar idioma guardado o por defecto
    const language = await this.storage.get('language') || 'es';  // Español por defecto
    this.setLanguage(language);
    
    // Cargar tema guardado o por defecto
    const theme = await this.storage.get('theme') || 'light';  // Tema claro por defecto
    this.setTheme(theme);
  }

  // Cambiar el idioma
  setLanguage(language: string) {
    this.translate.use(language);
    this.storage.set('language', language);
  }

  // Cambiar el tema
  setTheme(theme: string) {
    // Aplica el tema al body de la aplicación
    document.body.setAttribute('color-theme', theme);
    this.storage.set('theme', theme);
  }
}
