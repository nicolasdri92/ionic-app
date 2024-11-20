import { Component } from "@angular/core";

@Component({
  selector: ".main",
  templateUrl: "./main.page.html",
})
export class MainPage {
  activeTab: string = "home";

  onTabChange(event: any) {
    this.activeTab = event.tab;
  }

  onTabEventClick() {
    localStorage.removeItem("eventItem");
  }
}
