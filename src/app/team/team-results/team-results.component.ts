import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { RequestParams } from '@models/request-params.model';
import { Subscription } from 'rxjs/Subscription';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-results',
    templateUrl: './team-results.component.html',
    styleUrls: ['./team-results.component.scss']
})
export class TeamResultsComponent implements OnDestroy {
    constructor(
        private competitionService: CompetitionService,
        private router: Router,
        private titleService: TitleService,
        private teamMatchService: TeamMatchService
    ) {
        this.subscribeToRouterEvents();
    }

    competition: Competition;
    competitionId: number;
    errorTeamMatches: string;
    errorCompetition: string;
    round: number;
    roundsArray: { id: number; title: string }[];
    routerEventsSubscription: Subscription;
    teamMatches: TeamMatch[];

    getCompetitionData(competitionId: number): void {
        this.competitionService.getCompetition(competitionId).subscribe(
            response => {
                this.errorCompetition = null;
                this.competition = response;
                this.roundsArray = UtilsService.createRoundsArray(this.competition.number_of_teams);
            },
            error => {
                this.competition = null;
                this.errorCompetition = error;
            }
        );
    }

    getTeamMatchesData(competitionId: number, round?: number): void {
        const params: RequestParams[] = [
            { parameter: 'filter', value: 'round' },
            { parameter: 'competition_id', value: competitionId.toString() }
        ];
        if (round) {
            params.push({ parameter: 'page', value: round.toString() });
        }
        this.teamMatchService.getTeamMatches(params).subscribe(
            response => {
                if (response) {
                    this.round = response.current_page;
                    this.teamMatches = response.data;
                } else {
                    this.teamMatches = null;
                }
                this.errorTeamMatches = null;
            },
            error => {
                this.errorTeamMatches = error;
                this.teamMatches = null;
            }
        );
    }

    ngOnDestroy() {
        if (!this.routerEventsSubscription.closed) {
            this.routerEventsSubscription.unsubscribe();
        }
    }

    private setPageTitle(): void {
        this.titleService.setTitle(`Результати ${this.round ? this.round + ' туру' : 'поточного туру'} - Командний`);
    }

    private subscribeToRouterEvents(): void {
        this.routerEventsSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const urlAsArray = event.url.split('/');

                const temporaryCompetitionsIndex = urlAsArray.findIndex(item => item === 'competitions');
                if (temporaryCompetitionsIndex > -1) {
                    this.competitionId = parseInt(urlAsArray[temporaryCompetitionsIndex + 1], 10);
                }

                const temporaryRoundIndex = urlAsArray.findIndex(item => item === 'round');
                if (temporaryRoundIndex > -1) {
                    this.round = parseInt(urlAsArray[temporaryRoundIndex + 1], 10);
                }

                this.setPageTitle();

                if (!this.competitionId) {
                    return;
                }

                this.getTeamMatchesData(this.competitionId, this.round);
                if (!this.competition || (this.competition && this.competition.id !== this.competitionId)) {
                    this.getCompetitionData(this.competitionId);
                }
            }
        });
    }
}
