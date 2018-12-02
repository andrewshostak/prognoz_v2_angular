import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupMatch } from '@models/cup/cup-match.model';
import { CupMatchService } from '@services/cup/cup-match.service';
import { CupPrediction } from '@models/cup/cup-prediction.model';
import { CupPredictionService } from '@services/cup/cup-prediction.service';
import { environment } from '@env';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { TimePipe } from '../../shared/pipes/time.pipe';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-cup-match',
    templateUrl: './cup-cup-match.component.html',
    styleUrls: ['./cup-cup-match.component.scss']
})
export class CupCupMatchComponent implements OnDestroy, OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private cupCupMatchService: CupCupMatchService,
        private cupMatchService: CupMatchService,
        private cupPredictionService: CupPredictionService,
        private timePipe: TimePipe,
        private titleService: TitleService
    ) {}

    activatedRouteSubscription: Subscription;
    cupCupMatch: CupCupMatch;
    cupMatches: CupMatch[];
    cupPredictionsRequestsEnded: boolean;
    errorCupCupMatch: string;
    errorCupMatches: string;
    errorCupPredictions: string;
    numberOfHomePredictions: number;
    numberOfAwayPredictions: number;
    numberOfMatchesInStage: number;
    showScoresOrString = UtilsService.showScoresOrString;
    userImageDefault: string;
    userImagesUrl: string;

    getCupPrediction(cupMatch: CupMatch, cupPrediction: CupPrediction): string {
        if (cupMatch.is_predictable) {
            return '?';
        }
        if (cupPrediction) {
            return this.showScoresOrString(cupPrediction.home, cupPrediction.away, '-');
        }
        return '-';
    }

    getCupPredictionTime(cupMatch: CupMatch, cupPrediction: CupPrediction): string {
        if (cupMatch.is_predictable) {
            return 'Прогнози гравців відображаються після початку другого тайму матчу';
        }
        if (cupPrediction) {
            const date = this.timePipe.transform(cupPrediction.updated_at, 'YYYY-MM-DD HH:mm');
            return 'Прогноз зроблено ' + date;
        }
        return 'Прогноз не зроблено';
    }

    isCupMatchGuessed(cupMatch: CupMatch, prediction: string): boolean {
        if (cupMatch.is_predictable || cupMatch.active || prediction === '-') {
            return false;
        }
        return this.showScoresOrString(cupMatch.home, cupMatch.away, '') === prediction;
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.numberOfMatchesInStage = environment.tournaments.cup.numberOfMatchesInStage;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupCupMatchService.getCupCupMatch(params['cupCupMatchId']).subscribe(
                response => {
                    this.cupCupMatch = response;
                    this.cupCupMatch.score = this.showScoresOrString(this.cupCupMatch.home, this.cupCupMatch.away, 'vs');
                    this.titleService.setTitle(`${response.home_user.name} vs ${response.away_user.name} - Кубок`);
                    this.errorCupCupMatch = null;
                    this.getCupMatchesData(this.cupCupMatch.cup_stage_id);
                },
                error => {
                    this.cupCupMatch = null;
                    this.errorCupCupMatch = error;
                }
            );
        });
    }

    private getCupMatchesData(cupStageId: number): void {
        this.cupMatchService.getCupMatches(null, null, null, null, null, cupStageId).subscribe(
            response => {
                this.errorCupMatches = null;
                if (response && response.cup_matches) {
                    this.cupMatches = response.cup_matches;
                    const cupPredictionsHome = this.cupPredictionService.getCupPredictions(
                        this.cupCupMatch.id,
                        this.cupCupMatch.home_user_id
                    );
                    const cupPredictionsAway = this.cupPredictionService.getCupPredictions(
                        this.cupCupMatch.id,
                        this.cupCupMatch.away_user_id
                    );

                    forkJoin([cupPredictionsHome, cupPredictionsAway], (home, away) => {
                        return { home, away };
                    }).subscribe(r => {
                        this.numberOfHomePredictions = 0;
                        this.numberOfAwayPredictions = 0;
                        this.errorCupPredictions = null;
                        this.cupMatches = this.cupMatches.map(cupMatch => {
                            const homePrediction = r.home ? r.home.find(prediction => prediction.cup_match_id === cupMatch.id) : null;
                            const awayPrediction = r.away ? r.away.find(prediction => prediction.cup_match_id === cupMatch.id) : null;
                            cupMatch.home_prediction = this.getCupPrediction(cupMatch, homePrediction);
                            cupMatch.away_prediction = this.getCupPrediction(cupMatch, awayPrediction);
                            cupMatch.home_prediction_created_at = this.getCupPredictionTime(cupMatch, homePrediction);
                            cupMatch.away_prediction_created_at = this.getCupPredictionTime(cupMatch, awayPrediction);
                            if (homePrediction) {
                                this.numberOfHomePredictions++;
                            }
                            if (awayPrediction) {
                                this.numberOfAwayPredictions++;
                            }
                            return cupMatch;
                        });
                        this.cupPredictionsRequestsEnded = true;
                    }, error => (this.errorCupPredictions = error));
                }
            },
            error => {
                this.cupMatches = null;
                this.errorCupMatches = error;
            }
        );
    }
}
