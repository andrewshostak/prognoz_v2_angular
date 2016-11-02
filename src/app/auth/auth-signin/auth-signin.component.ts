import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { Router }                               from '@angular/router';

import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.css']
})
export class AuthSigninComponent implements OnInit {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    user: any;
    errorMessage: string;
    signIn: FormGroup;

    onSubmit() {
        this.userService.login(this.signIn.value.name, this.signIn.value.password)
            .subscribe(
                result => {
                    if (result) {
                        this.user = result;
                        this.userService.addSharedUser(result);
                        alert('Аутентифікація успішна!');
                        this.router.navigate(['/']);
                    }
                },
                error => {
                    if(error.json().status_code === 401){
                        this.errorMessage = <any>error.json();
                    } else if(error.json().status_code === 422) {
                        this.errorMessage = <any>error.json().errors;
                    }
                }
            );
    }

    ngOnInit() {
        this.userService.sharedUser$.subscribe(currentUser => {
            this.user = currentUser;
        });

        this.userService.loadSharedUser();

        if (!this.user) this.user = JSON.parse(localStorage.getItem('user'));

        this.signIn = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3)]),
            password: new FormControl('', [Validators.required])
        });
    }

    logout() {
        this.userService.logout();
        this.user = false;
        this.userService.addSharedUser(false);
    }
}