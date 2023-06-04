/* tslint:disable:variable-name */
import { UserNew } from '@models/new/user-new.model';

export class GuestbookMessageNew {
   id: number;
   user_id: number;
   body: string;
   created_at: string;
   updated_at: string;
   updated_by: number;
   deleted_at: string;
   deleted_by: number;

   is_changeable?: boolean;

   user?: UserNew;
   updater?: Partial<UserNew>;
   deleter?: Partial<UserNew>;
}
