import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule }                     from '../shared/shared.module';
import { TeamCaptainComponent }             from './team-captain/team-captain.component';
import { TeamComponent }                    from './team.component';
import { TeamMatchesComponent }             from './team-matches/team-matches.component';
import { TeamMyComponent }                  from './team-my/team-my.component';
import { TeamParticipantService }           from './shared/team-participant.service';
import { TeamPredictionsComponent }         from './team-predictions/team-predictions.component';
import { TeamPredictionService }            from './shared/team-prediction.service';
import { TeamRoutingModule }                from './team-routing.module';
import { TeamRulesComponent }               from './team-rules/team-rules.component';
import { TeamService }                      from './shared/team.service';
import { TeamSquadsComponent }              from './team-squads/team-squads.component';
import { TeamTeamMatchService }             from './shared/team-team-match.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TeamRoutingModule
    ],
    declarations: [
        TeamComponent,
        TeamMatchesComponent,
        TeamMyComponent,
        TeamPredictionsComponent,
        TeamRulesComponent,
        TeamSquadsComponent,
        TeamCaptainComponent,
    ],
    exports: [
        TeamComponent
    ],
    providers: [
        TeamParticipantService,
        TeamPredictionService,
        TeamService,
        TeamTeamMatchService,
    ]
})
export class TeamModule { }
