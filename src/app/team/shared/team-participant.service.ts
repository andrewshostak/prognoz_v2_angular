import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TeamParticipant } from '../../shared/models/team-participant.model';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { HeadersWithToken } from '../../core/headers-with-token.service';
import { RequestParams } from '../../shared/models/request-params.model';

@Injectable()
export class TeamParticipantService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private teamParticipantUrl = environment.apiUrl + 'team/participants';

    /**
     * Get team participants
     * @param requestParams
     * @returns {Observable<any>}
     */
    getTeamParticipants(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient
            .get(this.teamParticipantUrl, {params: params})
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get participants for captain
     *
     * @param requestParams
     * @returns {Observable<any>}
     */
    getCurrentTeamParticipants(requestParams: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
        }
        return this.headersWithToken
            .get(this.teamParticipantUrl, params)
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Create team participant
     * @param teamParticipant
     * @returns {Observable<TeamParticipant>}
     */
    createTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
        return this.headersWithToken
            .post(this.teamParticipantUrl, teamParticipant)
            .map(response => response['team_participant'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update team participant
     * @param teamParticipant
     * @returns {Observable<TeamParticipant>}
     */
    updateTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
        return this.headersWithToken
            .put(`${this.teamParticipantUrl}/${teamParticipant.id}`, teamParticipant)
            .map(response => response['team_participant'])
            .catch(this.errorHandlerService.handle);
    }
}
