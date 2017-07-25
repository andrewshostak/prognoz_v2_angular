import { Component, OnInit }             from '@angular/core';
import { ActivatedRoute, Params }        from '@angular/router';

import { ChampionshipPrediction }        from '../../../../shared/models/championship-prediction.model';
import { ChampionshipPredictionService } from '../../../shared/championship-prediction.service';
import { ChampionshipRating }            from '../../../../shared/models/championship-rating.model';
import { ChampionshipRatingService }     from '../../../shared/championship-rating.service';
import { environment }                   from '../../../../../environments/environment';
import { HelperService }                 from '../../../../core/helper.service';
import { User }                          from '../../../../shared/models/user.model';
import { UserService }                   from '../../../../core/user.service';

@Component({
  selector: 'app-championship-competition-user',
  templateUrl: './championship-competition-user.component.html',
  styleUrls: ['./championship-competition-user.component.css']
})
export class ChampionshipCompetitionUserComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private championshipPredictionService: ChampionshipPredictionService,
        private championshipRatingService: ChampionshipRatingService,
        public helperService: HelperService,
        private userService: UserService
    ) { }

    championshipPredictions: ChampionshipPrediction[];
    championshipRatingItem: ChampionshipRating;
    errorChampionshipPredictions: string;
    errorRating: string;
    errorUser: string;
    spinnerChampionshipPredictions: boolean = false;
    spinnerRating: boolean = false;
    spinnerUser: boolean = false;
    user: User;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getUserData(params['userId']);
            this.getChampionshipRatingItemData(params['userId'], params['competitionId']);
            this.getChampionshipPredictionsData(params['userId'], params['competitionId']);
        });
    }

    private getChampionshipPredictionsData(userId: number, competitionId: number) {
        this.spinnerChampionshipPredictions = true;
        let param = [
            {parameter: 'user-id', value: userId.toString()},
            {parameter: 'competition-id', value: competitionId.toString()}
        ];
        this.championshipPredictionService.getChampionshipPredictions(param).subscribe(
            response => {
                if (response) {
                    this.championshipPredictions = response.championship_predicts;
                }
                this.spinnerChampionshipPredictions = false;
            },
            error => {
                this.errorChampionshipPredictions = error;
                this.spinnerChampionshipPredictions = false;
            }
        );
    }

    private getChampionshipRatingItemData(userId: number, competitionId: number) {
        this.spinnerRating = true;
        this.championshipRatingService.getChampionshipRatingItem(userId, competitionId).subscribe(
            response => {
                this.championshipRatingItem = response;
                this.spinnerRating = false;
            },
            error => {
                this.errorRating = error;
                this.spinnerRating = false;
            }
        );
    }

    private getUserData(id: number) {
        this.spinnerUser = true;
        this.userService.getUser(id).subscribe(
            response => {
                this.user = response;
                this.spinnerUser = false;
            },
            error => {
                this.errorUser = error;
                this.spinnerUser = false;
            }
        );
    }
}
