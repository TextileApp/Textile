import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular'
import Cropper from 'cropperjs';

@Component({
    selector: 'img-cropper',
    templateUrl: 'img-cropper.html'
})
export class ImageCropperComponent {

    imageB64: any;
    imageB64Tagged: any;
    aspectRatio: any;
    cropper: Cropper;
    @ViewChild('imgSrc') input: ElementRef;

    constructor(public navCrtl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
        this.imageB64 = "data:image/jpeg;base64,"+this.navParams.get("imgUri");
        this.aspectRatio = this.navParams.get("aspectRatio");
        //this.imageB64Tagged = "data:image/jpeg;base64,"+this.imageB64;
    }

    imageLoaded() {
        this.cropper = new Cropper(this.input.nativeElement, {
            aspectRatio: this.aspectRatio,
            dragMode: 'crop',
            modal: true,
            guides: true,
            highlight: false,
            viewMode:0,
            background: true,
            autoCrop: true,
            rotatable: false,
            scalable: false,
            zoomable: false,
            zoomOnTouch: false,
            autoCropArea: 0.9,
            responsive: true,
            crop: (e:Cropper.CropperCustomEvent) => {

            }
        });
    }

    confirm() {
        let croppedImgB64String: string = this.cropper.getCroppedCanvas({
            fillColor: '#ffff',
            width: 1080,
            height: 1080
        }).toDataURL('image/jpeg', (90 / 100)); // 90 / 100 = photo quality
        console.log(croppedImgB64String);
        this.viewCtrl.dismiss(croppedImgB64String);
        // alert(croppedImgB64String);
        //this.navCrtl.popTo(contac, {'croppedImgB64String' : croppedImgB64String});
    }
}