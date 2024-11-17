import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Geolocation } from "@capacitor/geolocation";
import { GoogleMap } from "@capacitor/google-maps";
import { environment } from "@env/environment";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-google-maps",
  templateUrl: "./google-maps.component.html",
  styleUrls: ["./google-maps.component.scss"],
})
export class GoogleMapsComponent implements AfterViewInit {
  @ViewChild("map", { static: true }) mapRef: ElementRef<HTMLElement>;

  map: GoogleMap | null = null;
  clickedCoords: { latitude: number; longitude: number } | null = null;
  marker: string | null = null;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngAfterViewInit(): void {
    this.initGoogleMaps();
  }

  async initGoogleMaps() {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        await this.presentToast(
          "No tiene permisos suficientes para mostrar el mapa",
          "danger"
        );
        return;
      }

      if (!this.mapRef) {
        await this.presentToast("Error al cargar el mapa", "danger");
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      const {
        coords: { latitude, longitude },
      } = position;

      // Intentar crear el mapa si es posible
      const mapElement = this.mapRef.nativeElement;
      if (mapElement) {
        this.map = await GoogleMap.create({
          id: "map",
          element: mapElement,
          apiKey: environment.GOOGLE_MAP_API_KEY,
          config: {
            zoomControl: false,
            disableDefaultUI: true,
            streetViewControl: false,
            mapTypeControl: false,
            center: {
              lat: latitude,
              lng: longitude,
            },
            zoom: 16,
          },
        });

        this.addMarker(latitude, longitude);

        this.map.setOnMapClickListener(async (event) => {
          const { latitude, longitude } = event;
          this.clickedCoords = { latitude, longitude };
          this.updateMarker(latitude, longitude);
        });
      } else {
        await this.presentToast("Error al cargar el mapa", "danger");
      }
    } catch (error) {
      console.error(error);
      await this.presentToast("Se produjo un error", "danger");
    }
  }

  async checkPermissions() {
    const permissions = await Geolocation.checkPermissions();
    return (
      permissions.location === "granted" &&
      permissions.coarseLocation === "granted"
    );
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      buttons: [{ role: "cancel", text: "OK" }],
    });
    await toast.present();
  }

  async addMarker(lat: number, lng: number) {
    if (this.map) {
      try {
        this.marker = await this.map.addMarker({
          coordinate: { lat, lng },
        });
        this.clickedCoords = { latitude: lat, longitude: lng };
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    }
  }

  async updateMarker(lat: number, lng: number) {
    if (this.map && this.marker) {
      try {
        await this.map.removeMarker(this.marker);
        this.addMarker(lat, lng);
      } catch (error) {
        console.error("Error updating marker:", error);
      }
    }
  }

  saveLocation() {
    if (this.marker) {
      localStorage.setItem("coords", JSON.stringify(this.clickedCoords));
      this.onClose();
    }
  }

  onClose() {
    this.router.navigate(["/main/event"]);
  }
}
