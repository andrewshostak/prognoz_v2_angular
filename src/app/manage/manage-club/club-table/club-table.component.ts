import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { ClubNewService } from '@services/new/club-new.service';
import { ClubNew } from '@models/new/club-new.model';
import { Subscription } from 'rxjs';
import { ClubSearch } from '@models/search/club-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';
import { Pagination } from '@models/pagination.model';
import { PaginationService } from '@services/pagination.service';
import { OpenedModal } from '@models/opened-modal.model';
import { remove } from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
   selector: 'app-club-table',
   templateUrl: './club-table.component.html',
   styleUrls: ['./club-table.component.scss']
})
export class ClubTableComponent implements OnDestroy, OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private clubNewService: ClubNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private router: Router
   ) {}

   public activatedRouteSubscription: Subscription;
   public clubs: ClubNew[] = [];
   public openedModal: OpenedModal<ClubNew>;
   public paginationData: Pagination;
   public searchForm: FormGroup;

   public deleteClub(): void {
      this.clubNewService.deleteClub(this.openedModal.data.id).subscribe(() => {
         remove(this.clubs, this.openedModal.data);
         this.paginationData.total--;
         this.notificationsService.success('Успішно', `${this.openedModal.data.title} видалено`);
         this.openedModal.reference.close();
      });
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit(): void {
      this.searchForm = new FormGroup({ search: new FormControl(null) });
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getClubsData(params.pageNumber);
      });
      this.searchForm.valueChanges.pipe(distinctUntilChanged(), debounceTime(SettingsService.defaultDebounceTime)).subscribe(search => {
         this.paginationData.currentPage === 1 ? this.getClubsData(1) : this.router.navigate(['../1'], { relativeTo: this.activatedRoute });
      });
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement | TemplateRef<any>, data: ClubNew, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   private getClubsData(pageNumber: number): void {
      const search: ClubSearch = {
         limit: SettingsService.clubsPerPage,
         orderBy: 'updated_at',
         page: pageNumber,
         sequence: Sequence.Descending,
         search: this.searchForm.get('search').value,
         relations: ['parent']
      };
      this.clubNewService.getClubs(search).subscribe(response => {
         this.clubs = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/clubs/page/');
      });
   }
}
