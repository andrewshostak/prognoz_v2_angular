import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators }                                       from '@angular/forms';

import { NotificationsService }                                                     from 'angular2-notifications';
import { TeamMatch }                                                                from '../../models/team-match.model';
import { TeamPredictionService }                                                    from '../../../team/shared/team-prediction.service';
import { User }                                                                     from '../../models/user.model';

@Component({
    selector: 'app-team-goalkeeper-form',
    templateUrl: './team-goalkeeper-form.component.html',
    styleUrls: ['./team-goalkeeper-form.component.css']
})
export class TeamGoalkeeperFormComponent implements OnInit, OnChanges {

    @Input() blockedTeamMatch: TeamMatch;
    @Input() round: number;
    @Input() teamMatches: TeamMatch[];
    @Input() oppositeTeamId: number;
    @Input() authenticatedUser: User;
    @Output() reloadData = new EventEmitter<any>();

    teamGoalkeeperForm: FormGroup;
    spinnerButton: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private teamPredictionService: TeamPredictionService
    ) { }

    matchHasPrediction(teamMatch: TeamMatch): boolean {
        return teamMatch.team_predictions && teamMatch.team_predictions[0];
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (!changes[propName].firstChange && propName === 'blockedTeamMatch') {
                this.teamGoalkeeperForm.patchValue({team_match_id: changes[propName].currentValue.id});
            }
        }
    }

    ngOnInit() {
        this.teamGoalkeeperForm = this.formBuilder.group({
            team_match_id: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.teamGoalkeeperForm.valid) {
            this.spinnerButton = true;
            let selectedTeamMatch = this.teamMatches.find((teamMatch) => {
                return teamMatch.id === parseInt(this.teamGoalkeeperForm.value.team_match_id);
            });
            let teamPrediction = {
                id: this.matchHasPrediction(selectedTeamMatch) ? selectedTeamMatch.team_predictions[0].id : null,
                team_id: this.oppositeTeamId,
                team_match_id: selectedTeamMatch.id,
                blocked_by: this.authenticatedUser.id,
                unblock_id: this.blockedTeamMatch ? this.blockedTeamMatch.id : null
            };
            this.teamPredictionService.updateTeamPrediction(teamPrediction).subscribe(
                response => {
                    this.notificationService.success('Успішно', 'Матч заблоковано');
                    this.reloadData.emit();
                    this.spinnerButton = false;
                },
                errors => {
                    errors.forEach(error => this.notificationService.error('Помилка', error));
                    this.reloadData.emit();
                    this.spinnerButton = false;
                }
            );
        }
    }
}
