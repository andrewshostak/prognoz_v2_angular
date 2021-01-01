import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommentNew } from '@models/new/comment-new.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '@services/utils.service';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { NotificationsService } from 'angular2-notifications';
import { CommentNewService } from '@app/news/shared/comment-new.service';
import { trim } from 'lodash';

@Component({
   selector: 'app-comment-form',
   templateUrl: './comment-form.component.html'
})
export class CommentFormComponent implements OnInit {
   @Input() public newsId: number;
   @Output() public commentCreated = new EventEmitter<CommentNew>();

   public commentForm: FormGroup;
   public showFormErrorMessage = UtilsService.showFormErrorMessage;
   public showFormInvalidClass = UtilsService.showFormInvalidClass;
   public spinnerButton = false;
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private commentService: CommentNewService,
      private notificationsService: NotificationsService
   ) {}

   public ngOnInit(): void {
      this.user = this.authService.getUser();

      this.commentForm = new FormGroup({
         body: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
      });
   }

   public submit(): void {
      if (this.commentForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const message = { body: trim(this.commentForm.get('body').value), news_id: this.newsId };
      this.commentService.createComment(message).subscribe(
         response => {
            this.spinnerButton = false;
            this.commentForm.reset();
            this.notificationsService.success('Успішно', 'Коментар додано');
            this.commentCreated.emit(response);
         },
         () => (this.spinnerButton = false)
      );
   }
}
