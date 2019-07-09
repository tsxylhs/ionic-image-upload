import {Component} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {HttpClient} from '@angular/common/http';
import {FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {File} from '@ionic-native/file/ngx';
import {stringify} from 'qs';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    path: string = 'assets/icon/favicon.png';
    deviceId: string = '';
    address: string = '';
    latlong: string = '';

    constructor(private camera: Camera,
                private geolocation: Geolocation,
                private transfer: FileTransferObject,
                private file: File,
                public alertController: AlertController,
                private http: HttpClient,
    ) {
    }

    openCamera() {
        const options: CameraOptions = {
            quality: 90,                                                   // 相片质量 0 -100
            destinationType: this.camera.DestinationType.DATA_URL,        // DATA_URL 是 base64   FILE_URL 是文件路径
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,                                       // 是否保存到相册
            // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
        };

        this.camera.getPicture(options).then((imageData) => {
            console.log('got file: ' + imageData);

            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.path = base64Image;

            // If it's file URI
            // this.path = imageData;
            // this.upload();

        }, (err) => {
            // Handle error
        });
    }

    async altersubmit() {
        const alter = await this.alertController.create({
            header: '提示信息',
            message: '请先获取坐标',
            buttons: [{
                text: '返回',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    console.log('"返回');
                }
            }, {
                text: '获取位置坐标',
                handler: () => {
                    this.getLongLat();
                }
            }]
        });
    }

    async alterMessage(resp) {
        const alert = await this.alertController.create({
            header: '提示信息',
            message: '坐标获取' + resp + '',
            buttons: ['确定']
        });
        await alert.present();
    }

    async alterSubmitsuccess() {
        const alert = await this.alertController.create({
            header: '提示信息',
            message: '提交成功！',
            buttons: ['确定']
        });
        await alert.present();
    }

    async alterSubmitError(err) {
        const alert = await this.alertController.create({
            header: '提示信息',
            message: '提交失败，提示信息为' + stringify.toString(err),
            buttons: ['确定']
        });
        await alert.present();
    }

    getLongLat() {
        this.geolocation.getCurrentPosition().then((resp) => {
            console.log(resp);
            // resp.coords.latitude
            // resp.coords.longitude
            this.latlong = resp.coords.latitude + ',' + resp.coords.longitude;
            this.alterMessage('成功！' + this.latlong);
        }).catch((error) => {
            console.log('Error getting location', error);
            this.alterMessage('失败！ ：000000000.00000000');
        });

        // let watch = this.geolocation.watchPosition();
        // watch.subscribe((data) => {
        //     // data can be a set of coordinates, or an error (if an error occurred).
        //     // data.coords.latitude
        //     // data.coords.longitude
        // });
    }

    submitMessageT() {

        console.log('test');
        // if (this.latlong === '') {
        //     this.altersubmit();
        // } else {
        const apiPath = 'https://www.topiot.co/api/v1/deviceloaction/upload';
        let optionsss = new class implements FileUploadOptions {
            chunkedMode: boolean;
            fileKey: 'gee';
            fileName: 'test.jpg';
            headers: { Connection: 'close' };
            httpMethod: string;
            mimeType: string;
            params: {
                // devcieId: this.deviceId, address: this.deviceId, latlong: this.latlong,
                maxSize: 5000000,
                modularName: 'CNL',
                allowType: 'jpg;png;pdf;doc;xls;xlsx;docx',
            };
        };
        // let optionsss: FileUploadOptions = {
        //     fileKey: 'file',
        //     fileName: this.deviceId + '.jpg',   // 文件名称
        //     params: {
        //         devcieId: this.deviceId,
        //         address: this.deviceId,
        //         latlong: this.latlong,
        //         maxSize: 5000000,
        //         modularName: 'CNL',
        //         allowType: 'jpg;png;pdf;doc;xls;xlsx;docx',
        //     }
        // };
        optionsss.httpMethod = 'POST';
        optionsss.headers = {
            Connection: 'close'
        };
        this.transfer.upload('', apiPath, optionsss)
            .then((data) => {
                this.alterSubmitsuccess();
            }).catch((err) => {
            this.alterSubmitError(err);
        });

        //  }
    }

    submitMessage() {
        // if (this.latlong === '') {
        //     this.altersubmit();
        // } else {
        const apiPath = 'http://192.168.0.105:8001/api/v1/deviceloaction/upload';
        console.log('test');
        let formData = new FormData();
        formData.append('file', this.path);
        formData.append('deviceId', this.deviceId);
        formData.append('address', this.address);
        formData.append('latlong', this.latlong);
        this.http.post(apiPath, formData, {}).subscribe((val) => {
                this.alterSubmitsuccess();
            },
            response => {
                this.alterSubmitError(response);
            },
            () => {
                const err = 'ceshi';
                // this.alterSubmitError(err);
            });
        // }
    }

    submitMessaget2() {
        if (this.latlong === '') {
            this.altersubmit();
        } else {
            // const apiPath = encodeURI('http://api.rocket.letsit.vip/api/v1/deviceloaction/upload');
            // this.http.uploadFile(apiPath, {
            //         devcieId: this.deviceId,
            //         address: this.deviceId,
            //         latlong: this.latlong
            //     }, {}, this.path, this.deviceId
            // ).then((res) => {
            //     this.alterSubmitsuccess();
            // }).catch((err) => {
            //     this.alterSubmitError(err);
            // });
        }

    }
}
