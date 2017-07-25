import { Component, OnDestroy, OnInit }         from '@angular/core';

import { ChampionshipMatch }                    from '../../../shared/models/championship-match.model';
import { ChampionshipMatchService }             from '../../../championship/shared/championship-match.service';
import { ChampionshipRatingService }            from '../../../championship/shared/championship-rating.service';
import { Club }                                 from '../../../shared/models/club.model';
import { ClubService }                          from '../../manage-club/shared/club.service';
import { environment }                          from '../../../../environments/environment';
import { NotificationsService }                 from 'angular2-notifications';

@Component({
  selector: 'app-match-edit-ended',
  templateUrl: './match-edit-ended.component.html',
  styleUrls: ['./match-edit-ended.component.css']
})
export class MatchEditEndedComponent implements OnInit, OnDestroy {

    constructor(
        private notificationService: NotificationsService,
        private championshipMatchService: ChampionshipMatchService,
        private championshipRatingService: ChampionshipRatingService,
        private clubService: ClubService
    ) { }

    championshipMatches: ChampionshipMatch[];
    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    errorClubs: string | Array<string>;
    isUpdatedMatches: boolean = false;
    noChampionshipMatches: string = 'В базі даних матчів не знайдено.';
    noClubs: string = 'В базі даних команд не знайдено.';
    spinnerButton: any = {};
    spinnerChampionshipMatches: boolean = false;
    spinnerClubs: boolean = false;
    spinnerUpdateRatingButton: boolean = false;
    updatedMatches: any = {};

    ngOnDestroy() {
        if (Object.keys(this.updatedMatches).length !== 0 && this.isUpdatedMatches) {
            this.updateRating();
        }
    }

    ngOnInit() {
        this.getChampionshipMatchesData();
        this.getClubsData();
    }

    onSubmit(match: ChampionshipMatch) {
        if (!this.validateResult(match.home) || !this.validateResult(match.away)) {
            this.notificationService.error('Помилка', 'Результат в матчі ' + match.id + ' введено неправильно');
            return;
        }
        this.spinnerButton['match_' + match.id] = true;
        let championshipMatch = new ChampionshipMatch;
        championshipMatch.id = match.id;
        championshipMatch.t1_id = match.t1_id;
        championshipMatch.t2_id = match.t2_id;
        championshipMatch.home = match.home;
        championshipMatch.away = match.away;
        this.championshipMatchService.updateChampionshipMatch(championshipMatch).subscribe(
            response => {
                this.spinnerButton['match_' + match.id] = false;
                this.updatedMatches['match_' + match.id] = response;
                this.isUpdatedMatches = true;
                this.notificationService.success('Успішно', 'Результат матчу ' + response.id + ' змінено');
            },
            errors => {
                this.spinnerButton['match_' + match.id] = false;
                for (let error of errors) {
                    this.notificationService.error('Помилка', error);
                }
            }
        );
    }

    updateRating() {
        this.spinnerUpdateRatingButton = true;
        this.championshipRatingService.updateChampionshipRatingItems().subscribe(
            response => {
                this.isUpdatedMatches = false;
                this.notificationService.success('Успішно', 'Рейтинг оновлено');
                this.spinnerUpdateRatingButton = false;
            },
            error => {
                this.notificationService.error('Помилка', 'Оновити рейтинг не вдалось');
                this.spinnerUpdateRatingButton = false;
            }
        );
    }

    private getChampionshipMatchesData() {
        this.spinnerChampionshipMatches = true;
        let param = [{parameter: 'filter', value: 'ended'}];
        this.championshipMatchService.getChampionshipMatches(param).subscribe(
            response => {
                if (response) {
                    this.championshipMatches = response.championship_matches;
                }
              this.spinnerChampionshipMatches = false;
            },
            error => {
                this.errorChampionshipMatches = error;
                this.spinnerChampionshipMatches = false;
            }
        );
    }

    private getClubsData() {
        this.spinnerClubs = true;
        this.clubService.getClubs().subscribe(
            response => {
                this.clubs = response.clubs;
                this.spinnerClubs = false;
            },
            error => {
                this.errorClubs = error;
                this.spinnerClubs = false;
            }
        );
    }

    private validateResult(score) {
        let regExp = /^[0-9]$/;
        return regExp.test(score);
    }
}