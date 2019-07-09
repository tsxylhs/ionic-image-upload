import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HomePage} from './home.page';
import {FileUploadOptions, FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';

@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ])
    ],
    providers: [
        FileTransferObject,
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
