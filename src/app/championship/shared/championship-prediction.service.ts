import { Injectable }                       from '@angular/core';
import { Http, URLSearchParams }            from '@angular/http';
import { Observable }                       from 'rxjs/Observable';

import { ChampionshipPredict }              from '../../shared/models/championship-predict.model';
import { environment }                      from '../../../environments/environment';
import { ErrorHandlerService }              from '../../shared/error-handler.service';
import { HeadersWithToken }                 from '../../shared/headers-with-token.service';
import { RequestParams }                    from '../../shared/models/request-params.model';

@Injectable()

export class ChampionshipPredictionService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private http: Http
    ) {}

    private championshipPredictionUrl = environment.apiUrl + 'championship/predictions';

    /**
     * Update championship predictions
     * @returns {Observable<any>}
     */
    updateChampionshipPredictions(championshipPredictions: ChampionshipPredict[]): Observable<any> {
        return this.headersWithToken
            .put(this.championshipPredictionUrl, championshipPredictions)
            .map(response => response.json())
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get championshi predictions
     * @param requestParams
     * @returns {Observable<any>}
     */
    getChampionshipPredictions(requestParams?: RequestParams[]): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        if (requestParams) {
            for (let requestParam of requestParams) {
                params.set(requestParam.parameter, requestParam.value);
            }
        }
        return this.http
            .get(this.championshipPredictionUrl, requestParams ? {search: params} : null)
            .map(response => response.json())
            .catch(this.errorHandlerService.handle);
    }
}