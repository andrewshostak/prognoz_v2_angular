import { CommonModule }              from '@angular/common';
import { NgModule }                  from '@angular/core';
import { ReactiveFormsModule }       from '@angular/forms';

import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ManageNewsComponent }       from './manage-news.component';
import { ManageNewsGuard }           from './shared/manage-news-guard.service';
import { ManageNewsRoutingModule }   from './manage-news-routing.module';
import { NewsCreateComponent }       from './news-create/news-create.component';
import { NewsEditComponent }         from './news-edit/news-edit.component';
import { NewsTableComponent }        from './news-table/news-table.component';
import { SharedModule }              from '../../core/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ManageNewsRoutingModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger',
            focusButton: 'confirm'
        }),
        SharedModule
    ],
    declarations: [
        ManageNewsComponent,
        NewsTableComponent,
        NewsCreateComponent,
        NewsEditComponent
    ],
    providers: [
        ManageNewsGuard
    ]
})
export class ManageNewsModule { }
