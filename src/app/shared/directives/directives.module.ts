import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { AppRoutingModule }                  from '../../app-routing.module';

import { SpinnerComponent }                  from './spinner/spinner.component';
import { SpinnerButtonComponent }            from './spinner-button/spinner-button.component';
import { PaginationComponent }               from './pagination/pagination.component';
import { LastUserComponent }                 from './last-user/last-user.component';
import { ErrorComponent }                    from './error/error.component';
import { InfoComponent }                     from './info/info.component';
import { ChampionshipRatingTopComponent }    from './championship/championship-rating-top/championship-rating-top.component';
import { ChampionshipRatingLeaderComponent } from './championship/championship-rating-leader/championship-rating-leader.component';
import { ChampionshipLastResultsComponent }  from './championship/championship-last-results/championship-last-results.component';

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule
    ],
    declarations: [
        SpinnerComponent,
        SpinnerButtonComponent,
        PaginationComponent,
        LastUserComponent,
        ErrorComponent,
        InfoComponent,
        ChampionshipRatingTopComponent,
        ChampionshipRatingLeaderComponent,
        ChampionshipLastResultsComponent
    ],
    exports: [
        SpinnerComponent,
        SpinnerButtonComponent,
        PaginationComponent,
        LastUserComponent,
        ErrorComponent,
        InfoComponent,
        ChampionshipRatingTopComponent,
        ChampionshipRatingLeaderComponent,
        ChampionshipLastResultsComponent
    ]
})
export class DirectivesModule { }