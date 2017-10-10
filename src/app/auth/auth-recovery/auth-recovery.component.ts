import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';

import { AuthService }                          from '../../core/auth.service';
import { CurrentStateService }                  from '../../core/current-state.service';
import { NotificationsService }                 from 'angular2-notifications';
import { TitleService }                         from '../../core/title.service';
import { User }                                 from '../../shared/models/user.model';

@Component({
  selector: 'app-auth-recovery',
  templateUrl: './auth-recovery.component.html',
  styleUrls: ['./auth-recovery.component.css']
})
export class AuthRecoveryComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationService: NotificationsService,
        private titleService: TitleService
    ) { }

    recoveryForm: FormGroup;
    spinnerButton: boolean = false;
    user: User = this.currentStateService.user;

    ngOnInit() {
        this.titleService.setTitle('Відновлення паролю');
        this.authService.getUser.subscribe(response => this.user = response);
        let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.recoveryForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)])
        });
    }

    onSubmit() {
        if (this.recoveryForm.valid) {
            this.spinnerButton = true;
            this.authService.recovery(this.recoveryForm.value.email)
                .subscribe(
                    response => {
                        this.notificationService.success('Успішно', 'Подальші інструкції відправлено на ваш email', {timeOut: 0});
                        this.recoveryForm.get('email').disable();
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
    }
}
