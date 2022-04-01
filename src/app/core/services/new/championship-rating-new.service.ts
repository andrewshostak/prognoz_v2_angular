import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipRatingSearch } from '@models/search/championship-rating-search.model';
import { ChampionshipRatingNew } from '@models/new/championship-rating-new.model';
import { Observable } from 'rxjs';

@Injectable()
export class ChampionshipRatingNewService {
   public readonly championshipRatingUrl: string = `${environment.apiUrl}v2/championship/rating`;

   constructor(private httpClient: HttpClient) {}

   public getChampionshipRating(search: ChampionshipRatingSearch): Observable<PaginatedResponse<ChampionshipRatingNew>> {
      let params: HttpParams = new HttpParams();

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<ChampionshipRatingNew>>(this.championshipRatingUrl, { params });
   }
}
