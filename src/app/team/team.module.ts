import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';
import { ReactiveFormsModule }      from '@angular/forms';

import { SharedModule }             from '../shared/shared.module';
import { TeamComponent }            from './team.component';
import { TeamMatchesComponent }     from './team-matches/team-matches.component';
import { TeamParticipantService }   from './shared/team-participant.service';
import { TeamRoutingModule }        from './team-routing.module';
import { TeamRulesComponent }       from './team-rules/team-rules.component';
import { TeamService }              from './shared/team.service';
import { TeamSquadsComponent }      from './team-squads/team-squads.component';
import { TeamTeamMatchService }     from './shared/team-team-match.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        TeamRoutingModule
    ],
    declarations: [
        TeamComponent,
        TeamMatchesComponent,
        TeamRulesComponent,
        TeamSquadsComponent
    ],
    exports: [
        TeamComponent
    ],
    providers: [
        TeamParticipantService,
        TeamService,
        TeamTeamMatchService,
    ]
})
export class TeamModule { }
