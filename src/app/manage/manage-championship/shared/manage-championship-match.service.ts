import { Injectable }                       from '@angular/core';
import { Http, Response }                   from '@angular/http';
import { Observable }                       from 'rxjs/Observable';

import { API_URL }                          from '../../../shared/app.settings';
import { HeadersWithToken }                 from '../../../shared/headers-with-token.service';
import { ChampionshipMatch }                from '../shared/championship-match.model';

@Injectable()

export class ManageChampionshipMatchService {

    constructor(
        private http: Http,
        private headersWithToken: HeadersWithToken
    ) {}

    private championshipMatchUrl = API_URL + 'championship/matches';
    
    /**
     * Create championship match
     *
     * @param championshipMatch
     * @returns {Observable<R>}
     */
    create(championshipMatch: ChampionshipMatch): Observable<any> {
        return this.headersWithToken
            .post(this.championshipMatchUrl, championshipMatch)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Update active match (no result)
     *
     * @param championshipMatch
     * @returns {any|Promise<ErrorObservable<T>|T>|Promise<ErrorObservable<T>>|Promise<R>}
     */
    editActive(championshipMatch: ChampionshipMatch, id: number): Observable<ChampionshipMatch> {
        const url = `${this.championshipMatchUrl}/${id}`;
        return this.headersWithToken
            .put(url, championshipMatch)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Get all active matches
     *
     * @returns {any|Promise<ErrorObservable<T>|T>|Promise<ErrorObservable<T>>|Promise<R>}
     */
    getActive(): Observable<ChampionshipMatch[]> {
        return this.http
            .get(this.championshipMatchUrl + '/active')
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Get ended matches of current championship
     *
     * @returns {any|Promise<ErrorObservable<T>>|Promise<R>|Promise<ErrorObservable<T>|T>}
     */
    getEnded(): Observable<ChampionshipMatch[]> {
        let url = this.championshipMatchUrl + '/ended';
        return this.http
            .get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Add match result
     *
     * @param scores
     * @returns {Promise<ErrorObservable<T>|T>|Promise<ErrorObservable<T>>|any|Promise<R>}
     */
    addResult(scores): Observable<ChampionshipMatch> {
        const url = `${this.championshipMatchUrl}/${'results'}/${scores.id}`;
        return this.headersWithToken
            .put(url, scores)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Update ended match
     *
     * @param match
     * @returns {Promise<ErrorObservable<T>|T>|any|Promise<R>|Promise<ErrorObservable<T>>}
     */
    updateMatch(match): Observable<ChampionshipMatch> {
        const url = `${this.championshipMatchUrl}/${'ended'}/${match.id}`;
        return this.headersWithToken
            .put(url, match)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Transforms to json
     *
     * @param res
     * @returns {any}
     */
    private extractData(res: Response) {
        if (res && res.status !== 204) {
            let body = res.json();
            if (body.match) body = body.match;
            if (body.championship_matches) body = body.championship_matches;
            if (body.championship_match) body = body.championship_match;
            return body || {};
        }

        return res;
    }

    /**
     * Error handling
     *
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response | any) {
        let errorObject: any;
        let errorMessage: Array<any> = [];
        if (error instanceof Response) {
            errorObject = error.json();
            if (errorObject.status_code !== 422) {
                errorMessage.push(errorObject.message);
            } else {
                if (errorObject.errors.t1_id) errorMessage.push(errorObject.errors.t1_id);
                if (errorObject.errors.t2_id) errorMessage.push(errorObject.errors.t2_id);
                if (errorObject.errors.starts_at) errorMessage.push(errorObject.errors.starts_at);
                if (errorObject.errors.id) errorMessage.push(errorObject.errors.id);
                if (errorObject.errors.home) errorMessage.push(errorObject.errors.home);
                if (errorObject.errors.away) errorMessage.push(errorObject.errors.away);
            }
        } else {
            errorMessage.push('Невідома помилка');
        }

        return Observable.throw(errorMessage);
    }
}