import { Component, OnInit }                    from '@angular/core';
import { FormBuilder, FormGroup, Validators }   from '@angular/forms';

import { ChampionshipMatch }                    from '../../../shared/models/championship-match.model';
import { ChampionshipMatchService }             from '../../../championship/shared/championship-match.service';
import { Club }                                 from '../../../shared/models/club.model';
import { ClubService }                          from '../../manage-club/shared/club.service';
import { environment }                          from '../../../../environments/environment';
import { NotificationsService }                 from 'angular2-notifications';

@Component({
    selector: 'app-match-edit-active',
    templateUrl: './match-edit-active.component.html',
    styleUrls: ['./match-edit-active.component.css']
})
export class MatchEditActiveComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private championshipMatchService: ChampionshipMatchService,
        private clubService: ClubService
    ) { }

    championshipMatchEditActiveForm: FormGroup;
    championshipMatches: ChampionshipMatch[];
    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    errorClubs: string | Array<string>;
    noChampionshipMatches: string = 'В базі даних матчів не знайдено';
    selectedMatch: ChampionshipMatch;
    spinnerButton: boolean = false;
    spinnerChampionshipMatches: boolean = false;
    spinnerClubs: boolean = false;
    noClubs: string = 'В базі даних команд не знайдено.';

    ngOnInit() {
        this.championshipMatchEditActiveForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            t1_id: ['', [Validators.required]],
            t2_id: ['', [Validators.required]],
            starts_at: ['', [Validators.required]]
        });
        this.getChampionshipMatchesData();
        this.getClubsData();
    }

    onChange(id) {
        this.selectedMatch = this.championshipMatches.find(myObj => myObj.id == id);
        this.championshipMatchEditActiveForm.patchValue({
            id: this.selectedMatch.id,
            t1_id: this.selectedMatch.t1_id,
            t2_id: this.selectedMatch.t2_id,
            starts_at: this.selectedMatch.starts_at
        });
    }

    onSubmit() {
        if (this.selectedMatch.id) {
            this.spinnerButton = true;
            this.championshipMatchService.updateChampionshipMatch(this.championshipMatchEditActiveForm.value)
                .subscribe(
                    response => {
                        this.spinnerButton = false;
                        this.selectedMatch = response;

                        this.getChampionshipMatchesData();
                        this.notificationService.success('Успішно', 'Матч змінено');
                    },
                    error => {
                        this.spinnerButton = false;
                        this.notificationService.error('Помилка', error);
                    }
                );
        }
    }

    swapClubs() {
        let t1_id = this.championshipMatchEditActiveForm.value.t1_id;
        let t2_id = this.championshipMatchEditActiveForm.value.t2_id;
        this.championshipMatchEditActiveForm.patchValue({t1_id: t2_id, t2_id: t1_id});
    }

    resetForm() {
        this.championshipMatchEditActiveForm.reset();
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

    private getChampionshipMatchesData() {
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
}
