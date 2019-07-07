import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-competition-results',
   styleUrls: ['./championship-competition-results.component.scss'],
   templateUrl: './championship-competition-results.component.html'
})
export class ChampionshipCompetitionResultsComponent implements OnInit {
   public championshipMatches: ChampionshipMatchNew[];
   public errorChampionshipMatches: string;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipMatchService: ChampionshipMatchNewService,
      private titleService: TitleService
   ) {}

   public getEndedChampionshipMatchesData(competitionId: number): void {
      const search: ChampionshipMatchSearch = {
         competitionId,
         ended: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'number_in_competition',
         page: 1,
         sequence: Sequence.Descending
      };

      this.championshipMatchService.getChampionshipMatches(search).subscribe(
         response => {
            this.resetChampionshipMatchesData();
            this.championshipMatches = response.data;
         },
         error => {
            this.resetChampionshipMatchesData();
            this.errorChampionshipMatches = error;
         }
      );
   }

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.titleService.setTitle(`Результати матчів в конкурсі ${params.competitionId} - Чемпіонат`);
         this.getEndedChampionshipMatchesData(params.competitionId);
      });
   }

   private resetChampionshipMatchesData(): void {
      this.championshipMatches = null;
      this.errorChampionshipMatches = null;
   }
}
