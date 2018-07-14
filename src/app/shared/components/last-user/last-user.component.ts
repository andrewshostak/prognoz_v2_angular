import { Component, OnInit } from '@angular/core';

import { environment } from '@env';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-last-user',
    templateUrl: './last-user.component.html',
    styleUrls: ['./last-user.component.scss']
})
export class LastUserComponent implements OnInit {
    constructor(private userService: UserService) {}

    errorUser: string | Array<string>;
    lastUser: User;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;

    ngOnInit() {
        this.userService.getUsers(1, 'created_at', 'desc').subscribe(
            response => {
                this.lastUser = response.users[0];
            },
            error => {
                this.errorUser = error;
            }
        );
    }
}
