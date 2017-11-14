import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()

export class ImageService {

    private uploadedImage = new Subject<string>();
    private uploadError = new Subject<string>();

    uploadedImage$ = this.uploadedImage.asObservable();
    uploadError$ = this.uploadError.asObservable();

    fileChange(event, type) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            if (this.validateImage(fileList[0], type)) {
                let myReader: FileReader = new FileReader();
                myReader.onload = (e) => {
                    this.uploadedImage.next(myReader.result);
                };
                myReader.readAsDataURL(file);
            }
        }
    }

    private validateImage(image, accepted) {
        if (image.size > accepted.maxSize) {
            this.uploadError.next('Розмір завантаженого зображення перевищує ' + (accepted.maxSize / 1024) + 'кб');
            return false;
        }
        if (!image.type || (accepted.types.indexOf(image.type) < 0)) {
            this.uploadError.next('Вибрано неправильний тип зображення. Підтримувані формати: ' + accepted.types);
            return false;
        }
        return true;
    }
}