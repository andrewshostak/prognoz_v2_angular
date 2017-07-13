import { Component, OnDestroy, OnInit }         from '@angular/core';

import { ChampionshipMatch }                    from '../../../shared/models/championship-match.model';
import { ChampionshipMatchService }             from '../../../championship/shared/championship-match.service';
import { ChampionshipRatingService }            from '../../../championship/shared/championship-rating.service';
import { environment }                          from '../../../../environments/environment';
import { NotificationsService }                 from 'angular2-notifications';

@Component({
  selector: 'app-match-edit',
  templateUrl: './match-edit.component.html',
  styleUrls: ['./match-edit.component.css']
})
export class MatchEditComponent implements OnInit, OnDestroy {

    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private championshipRatingService: ChampionshipRatingService,
        private notificationService: NotificationsService
    ) { }

    championshipMatches: ChampionshipMatch[];
    spinnerChampionshipMatches: boolean = false;
    errorChampionshipMatches: string;
    noChampionshipMatches: string = 'В базі даних матчів не знайдено.';

    spinnerButton: any = {};
    updatedMatches: any = {};
    isUpdatedMatches: boolean = false;
    spinnerUpdateRatingButton: boolean = false;

    clubsImagesUrl: string = environment.apiImageClubs;
  
    ngOnInit() {
        this.spinnerChampionshipMatches = true;
        let param = [{parameter: 'filter', value: 'active'}];
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

    ngOnDestroy() { 
        if (Object.keys(this.updatedMatches).length !== 0 && this.isUpdatedMatches) {
           this.updateRating();
        }
    }

    onSubmit(match: ChampionshipMatch) {
        if (!this.validateResult(match.home) || !this.validateResult(match.away)) {
            this.notificationService.error('Помилка', 'Результат в матчі ' + match.id + ' введено неправильно');
            return;
        }
        this.spinnerButton['match_' + match.id] = true;
        let championshipMatch = new ChampionshipMatch;
        championshipMatch.id = match.id;
        championshipMatch.home = match.home;
        championshipMatch.away = match.away;
        this.championshipMatchService.updateChampionshipMatch(championshipMatch).subscribe(
            response => {
                this.spinnerButton['match_' + match.id] = false;
                this.updatedMatches['match_' + match.id] = response;
                this.isUpdatedMatches = true;
                this.notificationService.success('Успішно', 'Результат в матчі ' + response.id + ' добавлено!');
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

    private validateResult(score) {
        let regExp = /^[0-9]$/;
        return regExp.test(score);
    }
}
