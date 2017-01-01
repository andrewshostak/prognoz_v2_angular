import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { NotificationsService }                 from 'angular2-notifications';

import { UserService }                          from '../../shared/user.service';

@Component({
  selector: 'app-auth-reset',
  templateUrl: './auth-reset.component.html',
  styleUrls: ['./auth-reset.component.css']
})
export class AuthResetComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private notificationService: NotificationsService
    ) { }
  
    resetForm: FormGroup;
    spinner: boolean = false;

    ngOnInit() {
        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.activatedRoute.params.subscribe((params: Params) => {
            this.resetForm = new FormGroup({
                email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
                password: new FormControl('', [Validators.required, Validators.minLength(6)]),
                password_confirmation: new FormControl('', [Validators.required]),
                token: new FormControl(params['token'], [Validators.required])
            });
        });
    }

    onSubmit() {
        this.spinner = true;
        this.userService.reset(this.resetForm.value).subscribe(
            response => {
                this.router.navigate(['/signin']);
                this.notificationService.success('Успішно', 'Відновлення паролю пройшло успішно. Тепер ви можете виконати вхід на сайт. ');
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
