import { Router } from '@angular/router';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { CupStageState } from '@enums/cup-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupMatchNew } from '@models/new/cup-match-new.model';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupStageNew } from '@models/new/cup-stage-new.model';
import { CupStageTypeNew } from '@models/new/cup-stage-type-new.model';
import { CupStageTypeNewService } from '@services/new/cup-stage-type-new.service';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { UtilsService } from '@services/utils.service';
import { CupMatchSearch } from '@models/search/cup-match-search.model';
import { MatchState } from '@enums/match-state.enum';
import { SettingsService } from '@services/settings.service';
import { OpenedModal } from '@models/opened-modal.model';
import { uniqBy } from 'lodash';

@Component({
   selector: 'app-cup-stage-form',
   templateUrl: './cup-stage-form.component.html',
   styleUrls: ['./cup-stage-form.component.scss']
})
export class CupStageFormComponent implements OnChanges, OnInit {
   constructor(
      private competitionService: CompetitionNewService,
      private cupMatchService: CupMatchNewService,
      private cupStageService: CupStageNewService,
      private cupStageTypeService: CupStageTypeNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private router: Router
   ) {}

   @Input() cupStage: CupStageNew;

   competitions: CompetitionNew[] = [];
   cupMatches: CupMatchNew[] = [];
   cupStageForm: FormGroup;
   cupStageTypes: CupStageTypeNew[] = [];
   cupStageStates = CupStageState;
   openedModal: OpenedModal<null>;

   get cupMatchesFormArray(): FormArray {
      return this.cupStageForm.get('cup_matches') as FormArray;
   }

   addCupMatch(cupMatchId?: number): void {
      this.cupMatchesFormArray.push(
         new FormGroup({
            id: new FormControl(cupMatchId || null, [Validators.required])
         })
      );
   }

   ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.cupStageForm, 'cupStage', (formGroup, field, value) => {
         if (field === 'cup_matches') {
            this.clearCupMatchesFormArray();
            if (value.length) {
               value.forEach(cupMatch => {
                  if (!this.cupMatches) {
                     this.cupMatches = [];
                  }
                  if (!this.cupMatches.find(item => item.id === cupMatch.id)) {
                     this.cupMatches.push(cupMatch);
                  }
                  this.addCupMatch(cupMatch.id);
               });
            }
         } else {
            if (formGroup.get(field)) {
               formGroup.patchValue({ [field]: value });
            }
         }
      });
      if (!simpleChanges.cupStage.firstChange && simpleChanges.cupStage.currentValue.state === CupStageState.Ended) {
         this.cupMatches = simpleChanges.cupStage.currentValue.cup_matches;
         this.cupStageForm.disable();
      }
      if (!simpleChanges.cupStage.firstChange && simpleChanges.cupStage.currentValue.competition) {
         this.competitions = uniqBy(this.competitions.concat([simpleChanges.cupStage.currentValue.competition]), 'id');
      }
   }

   ngOnInit() {
      this.getCompetitionsData();
      this.getCupStageTypesData();
      this.getCupMatchesData();
      this.cupStageForm = new FormGroup({
         competition_id: new FormControl('', [Validators.required]),
         cup_stage_type_id: new FormControl('', [Validators.required]),
         round: new FormControl(1, [Validators.required]),
         title: new FormControl('', [Validators.required]),
         state: new FormControl(CupStageState.NotStarted, [Validators.required]),
         cup_matches: new FormArray([])
      });
   }

   onSubmit(): void {
      if (this.cupStageForm.invalid) {
         return;
      }

      this.cupStage ? this.updateCupStage(this.cupStageForm.value) : this.createCupStage(this.cupStageForm.value);
   }

   openConfirmModal(content: NgbModalRef | HTMLElement, data: null, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   removeCupMatch(index: number): void {
      this.cupMatchesFormArray.removeAt(index);
   }

   resetCupStageForm(): void {
      this.clearCupMatchesFormArray();
      this.cupStageForm.reset();
      if (this.cupStage) {
         this.cupStage.cup_matches.forEach(cupMatch => {
            this.addCupMatch(cupMatch.id);
         });
         Object.entries(this.cupStage).forEach(
            ([field, value]) => this.cupStageForm.get(field) && this.cupStageForm.patchValue({ [field]: value })
         );
      }
      this.openedModal.reference.close();
   }

   showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private clearCupMatchesFormArray(): void {
      UtilsService.clearFormArray(this.cupMatchesFormArray);
   }

   private createCupStage(cupStage: CupStageNew): void {
      const cupStageNew: Partial<CupStageNew> = {
         competition_id: cupStage.competition_id,
         cup_stage_type_id: cupStage.cup_stage_type_id,
         round: cupStage.round,
         title: cupStage.title
      };
      this.cupStageService.createCupStage(cupStageNew, cupStage.cup_matches).subscribe(response => {
         this.notificationsService.success('Успішно', `Кубкову стадію ${response.title} створено`);
         this.cupStageForm.get('round').reset();
         this.cupStageForm.get('title').reset();
      });
   }

   private getCupMatchesData(): void {
      const search: CupMatchSearch = {
         limit: SettingsService.maxLimitValues.cupMatches,
         page: 1,
         states: [MatchState.Active],
         relations: ['match.clubHome', 'match.clubAway']
      };
      this.cupMatchService.getCupMatches(search).subscribe(response => {
         if (!this.cupMatches) {
            this.cupMatches = response.data;
         } else {
            response.data.forEach(cupMatch => {
               if (!this.cupMatches.find(item => item.id === cupMatch.id)) {
                  this.cupMatches.push(cupMatch);
               }
            });
         }
      });
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         tournamentId: Tournament.Cup,
         states: [CompetitionState.NotStarted, CompetitionState.Applications, CompetitionState.Active]
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = uniqBy(this.competitions.concat(response.data), 'id');
      });
   }

   private getCupStageTypesData(): void {
      this.cupStageTypeService.getCupStageTypes().subscribe(response => (this.cupStageTypes = response.data));
   }

   private updateCupStage(cupStage: CupStageNew): void {
      const cupStageNew: Partial<CupStageNew> = {
         competition_id: cupStage.competition_id,
         cup_stage_type_id: cupStage.cup_stage_type_id,
         round: cupStage.round,
         title: cupStage.title,
         state: cupStage.state
      };
      let cupMatches = [];
      if (cupStage.cup_matches) {
         cupMatches = cupStage.cup_matches;
      }
      this.cupStageService.updateCupStage(this.cupStage.id, cupStageNew, cupMatches).subscribe(() => {
         this.notificationsService.success('Успішно', 'Кубкову стадію змінено');
         this.router.navigate(['/', 'manage', 'cup', 'stages']);
      });
   }
}
