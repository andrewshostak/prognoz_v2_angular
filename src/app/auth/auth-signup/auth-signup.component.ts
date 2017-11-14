import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { Router }                               from '@angular/router';

import { AuthService }                          from '../../core/auth.service';
import { CurrentStateService }                  from '../../core/current-state.service';
import { NotificationsService }                 from 'angular2-notifications';
import { TitleService }                         from '../../core/title.service';
import { User }                                 from '../../shared/models/user.model';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.css']
})
export class AuthSignupComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationService: NotificationsService,
        private router: Router,
        private titleService: TitleService
    ) { }

    captchaValidity: boolean = false;
    signUpForm: FormGroup;
    spinnerButton: boolean = false;
    user: User = this.currentStateService.user;

    ngOnInit() {
        this.titleService.setTitle('Реєстрація');
        this.authService.getUser.subscribe(response => this.user = response);
        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.signUpForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password_confirmation: new FormControl('', [Validators.required]),
        });
    }

    onSubmit() {
        if (this.signUpForm.valid) {
            this.spinnerButton = true;
            this.authService.signUp(this.signUpForm.value).subscribe(
                response => {
                    this.notificationService.success('Успішно', 'Реєстрація пройшла успішно', {timeOut: 0});
                    this.spinnerButton = false;
                    this.router.navigate(['/me']);
                },
                errors => {
                    for (let error of errors) {
                        this.notificationService.error('Помилка', error);
                    }
                    this.spinnerButton = false;
                }
            );
        }
    }

    resolved(captchaResponse: string) {
        if (captchaResponse) {
            this.captchaValidity = true;
        }
    }
}