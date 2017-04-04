import { Component, OnInit }                    from '@angular/core';
import { Router }                               from '@angular/router';
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { NotificationsService }                 from 'angular2-notifications';

import { ManageSeasonService }                  from '../shared/manage-season.service';

@Component({
    selector: 'app-season-create',
    templateUrl: './season-create.component.html',
    styleUrls: ['./season-create.component.css']
})
export class SeasonCreateComponent implements OnInit {

    constructor(
        private router: Router,
        private notificationService: NotificationsService,
        private manageSeasonService: ManageSeasonService
    ) { }

    seasonCreateForm: FormGroup;
    spinner: boolean = false;

    ngOnInit() {
        this.seasonCreateForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(20)])
        });
    }

    onSubmit() {
        this.spinner = true;
        this.manageSeasonService.create(this.seasonCreateForm.value).subscribe(
            response => {
                this.router.navigate(['/manage/seasons']);
                this.notificationService.success('Успішно', 'Сезон створено!');
                this.spinner = false;
            },
            errors => {
                for (let error of errors) {
                  this.notificationService.error('Помилка', error);
                }
                this.spinner = false;
            }
        );
    }

}
