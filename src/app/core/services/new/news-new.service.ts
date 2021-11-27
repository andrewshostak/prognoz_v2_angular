import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { NewsNew } from '@models/new/news-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { NewsSearch } from '@models/search/news-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NewsNewService {
   public readonly newsUrl: string = `${environment.apiUrl}v2/news`;

   constructor(private httpClient: HttpClient) {}

   public deleteNews(newsId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.newsUrl}/${newsId}`);
   }

   public getNews(search: NewsSearch): Observable<PaginatedResponse<NewsNew>> {
      let params: HttpParams = new HttpParams();

      if (search.authorId) {
         params = params.set('author_id', search.authorId.toString());
      }

      if (search.tournamentId) {
         params = params.set('tournament_id', search.tournamentId.toString());
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

      return this.httpClient.get<PaginatedResponse<NewsNew>>(this.newsUrl, { params });
   }

   public getNewsItem(newsId: number, relations: string[] = []): Observable<NewsNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ news: NewsNew }>(`${this.newsUrl}/${newsId}`, { params })
         .pipe(map(response => response.news));
   }
}
