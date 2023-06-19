import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CupRatingGroupTab } from '@enums/cup-rating-group-tab.enum';
import { Competition } from '@models/v2/competition.model';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';
import { CupRatingGroupSearch } from '@models/search/cup/cup-rating-group-search.model';
import { CompetitionNewService } from '@services/v2/competition-new.service';
import { CupGroupNumberNewService } from '@services/v2/cup-group-number-new.service';
import { CupRatingNewService } from '@services/v2/cup-rating-new.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { first, get, last } from 'lodash';

@Component({
   selector: 'app-cup-rating-group',
   styleUrls: ['./cup-rating-group.component.scss'],
   templateUrl: './cup-rating-group.component.html'
})
export class CupRatingGroupComponent implements OnInit {
   public competitionId: number;
   public cupRatingGroup: CupRatingGroup[];
   public getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
   public groupNumber: number;
   public groupNumbers: number[];
   public tab: CupRatingGroupTab = CupRatingGroupTab.Active;

   private competition: Competition;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private cupGroupNumberService: CupGroupNumberNewService,
      private cupRatingService: CupRatingNewService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public isFirstGroup(groupNumber: number): boolean {
      return first<number>(this.groupNumbers) === groupNumber;
   }

   public isLastGroup(groupNumber: number): boolean {
      return last<number>(this.groupNumbers) === groupNumber;
   }

   public navigateToGroup(groupNumber: number): void {
      this.router.navigate(['../' + groupNumber], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
   }

   public nextGroup(): void {
      if (this.isLastGroup(this.groupNumber)) {
         return;
      }

      this.navigateToGroup(++this.groupNumber);
   }

   public ngOnInit() {
      this.activatedRoute.queryParams.subscribe((params: Params) => {
         if (params.tab) {
            this.tab = params.tab;
         }
      });
      this.activatedRoute.params.subscribe((params: Params) => {
         this.competitionId = parseInt(params.competitionId, 10);
         this.groupNumber = parseInt(params.groupNumber, 10);
         this.titleService.setTitle(`Рейтинг групи ${this.groupNumber} - Кубок`);

         if (!this.groupNumbers) {
            this.getCupRatingGroupsData(this.competitionId);
         }

         if (!this.competition) {
            this.getCompetitionData(this.competitionId);
         }

         this.getCupRatingGroupData(this.competitionId, this.groupNumber);
      });
   }

   public previousGroup(): void {
      if (this.isFirstGroup(this.groupNumber)) {
         return;
      }

      this.navigateToGroup(--this.groupNumber);
   }

   public showPositionHighlight(index: number, key: string): boolean {
      if (!this.competition) {
         return false;
      }
      const promotion: number[] = get(this.competition, key);
      if (!promotion) {
         return false;
      }

      return promotion.includes(index + 1);
   }

   private getCompetitionData(competitionId: number): void {
      this.competitionService.getCompetition(competitionId).subscribe(response => (this.competition = response));
   }

   private getCupRatingGroupData(competitionId: number, groupNumber: number): void {
      const search: CupRatingGroupSearch = { competitionId, groupNumber };
      this.cupRatingService.getCupRatingGroup(search).subscribe(response => (this.cupRatingGroup = response.data));
   }

   private getCupRatingGroupsData(competitionId: number): void {
      this.cupGroupNumberService.getCupGroupMatches({ competitionId }).subscribe(response => (this.groupNumbers = response.data));
   }
}
