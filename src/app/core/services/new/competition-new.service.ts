import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CompetitionNew } from '@models/new/competition-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CompetitionNewService {
   public readonly competitionsUrl: string = `${environment.apiUrl}v2/competitions`;

   constructor(private httpClient: HttpClient) {}

   public getCompetition(id: number, relations: string[] = []): Observable<CompetitionNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ competition: CompetitionNew }>(`${this.competitionsUrl}/${id}`, { params })
         .pipe(map(response => response.competition));
   }

   public getCompetitions(search: CompetitionSearch): Observable<PaginatedResponse<CompetitionNew>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.tournamentId) {
         params = params.set('tournament_id', (search.tournamentId as unknown) as string);
      }

      if (search.seasonId) {
         params = params.set('season_id', (search.seasonId as unknown) as string);
      }

      if (search.states) {
         search.states.forEach(state => {
            params = params.append('states[]', state);
         });
      }

      return this.httpClient.get<PaginatedResponse<CompetitionNew>>(this.competitionsUrl, { params });
   }
}
