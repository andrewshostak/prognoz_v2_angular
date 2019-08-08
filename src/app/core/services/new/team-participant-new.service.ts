import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamParticipantSearch } from '@models/search/team-participant-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamParticipantNewService {
   public readonly teamParticipantsUrl: string = `${environment.apiUrl}v2/team/participants`;

   constructor(private httpClient: HttpClient) {}

   public getTeamParticipant(teamParticipantId: number): Observable<TeamParticipantNew> {
      return this.httpClient
         .get<{ team_participant: TeamParticipantNew }>(`${this.teamParticipantsUrl}/${teamParticipantId}`)
         .pipe(map(response => response.team_participant));
   }

   public getTeamParticipants(search: TeamParticipantSearch): Observable<PaginatedResponse<TeamParticipantNew>> {
      let params: HttpParams = new HttpParams();

      if (search.captain) {
         params = params.set('captain', (search.captain as unknown) as string);
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.confirmed) {
         params = params.set('confirmed', (search.confirmed as unknown) as string);
      }

      if (search.ended) {
         params = params.set('ended', (search.ended as unknown) as string);
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.refused) {
         params = params.set('refused', (search.refused as unknown) as string);
      }

      if (search.sequence) {
         params = params.set('sequence', search.sequence);
      }

      if (search.teamId) {
         params = params.set('team_id', search.teamId.toString());
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }
      return this.httpClient.get<PaginatedResponse<TeamParticipantNew>>(this.teamParticipantsUrl, { params });
   }
}
