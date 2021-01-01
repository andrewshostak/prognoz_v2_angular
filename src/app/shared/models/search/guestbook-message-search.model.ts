import { Sequence } from '@enums/sequence.enum';
import { ModelStatus } from '@enums/model-status.enum';

export class GuestbookMessageSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public userId?: number;
   public relations?: string[];
   public sequence?: Sequence;
   public trashed?: ModelStatus;
}
