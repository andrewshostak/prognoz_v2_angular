import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';

import { CommentService }       from './shared/comment.service';
import { NewsComponent }        from './news.component';
import { NewsDetailComponent }  from './news-detail/news-detail.component';
import { NewsListComponent }    from './news-list/news-list.component';
import { NewsRoutingModule }    from './news-routing.module';
import { NewsService }          from './shared/news.service';
import { SharedModule }         from '../core/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NewsRoutingModule,
        SharedModule
    ],
    declarations: [
        NewsComponent,
        NewsDetailComponent,
        NewsListComponent
    ],
    providers: [
        NewsService,
        CommentService
    ],
    exports: [
        NewsComponent
    ]
})
export class NewsModule { }