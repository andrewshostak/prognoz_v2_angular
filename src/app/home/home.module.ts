import { CommonModule }     from '@angular/common';
import { NgModule }         from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { HomeComponent }    from './home.component';
import { SharedModule }     from '../core/shared.module';

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        SharedModule
    ],
    declarations: [HomeComponent],
    exports: [HomeComponent]
})
export class HomeModule { }