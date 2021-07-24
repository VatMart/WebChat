import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatNativeDateModule} from "@angular/material/core";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {OverlayModule} from "@angular/cdk/overlay";
import {A11yModule} from "@angular/cdk/a11y";
import {PortalModule} from "@angular/cdk/portal";
import {MatListModule} from "@angular/material/list";

@NgModule({
  exports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    A11yModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    MatListModule
  ]
})

export class MaterialModule {
}
