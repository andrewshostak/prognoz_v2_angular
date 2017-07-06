import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { Router }                               from '@angular/router';

import { environment }                          from '../../../../environments/environment';
import { ImageService }                         from '../../../shared/image.service';
import { NotificationsService }                 from 'angular2-notifications';
import { NewsService }                          from '../../../news/shared/news.service';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css']
})
export class NewsCreateComponent implements OnInit {

    constructor(
        private imageService: ImageService,
        private notificationService: NotificationsService,
        private newsService: NewsService,
        private router: Router
    ) {
        imageService.uploadedImage$.subscribe(
            result => {
                this.newsCreateForm.patchValue({image: result});
                this.errorImage = null;
            }
        );
        imageService.uploadError$.subscribe(
            result => { this.errorImage = result }
        );
    }

    newsCreateForm: FormGroup;
    errorImage: string;
    spinnerButton: boolean = false;

    ngOnInit() {
        this.newsCreateForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
            body: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(3000)]),
            image: new FormControl(),
            tournament_id: new FormControl('', [Validators.required])
        });
    }

    onSubmit() {
        this.spinnerButton = true;
        this.newsService.createNewsItem(this.newsCreateForm.value).subscribe(
            response => {
                this.router.navigate(['/news/' + response.id]);
                this.notificationService.success('Успішно', 'Новину створено!');
                this.spinnerButton = false;
            },
            errors => {
                for (let error of errors) {
                   this.notificationService.error('Помилка', error);
                }
                this.spinnerButton = false;
            }
        );
    }

    fileChange(event) {
        this.imageService.fileChange(event, environment.imageSettings.news);
    }
}
