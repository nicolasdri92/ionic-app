import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmptyComponent } from './components/empty/empty.component';

const COMPONENTS = [EmptyComponent];
const MODULES = [CommonModule, FormsModule, ReactiveFormsModule, IonicModule];

@NgModule({
  declarations: [COMPONENTS],
  imports: [MODULES],
  exports: [MODULES, COMPONENTS],
})
export class SharedModule {}
