//gegenereerd door ionic zelf: tabs //

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// einde gen door ionic //
//zelf toegevoegd: //
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ListPage } from "../pages/list/list";
import { ScanPage } from "../pages/scan/scan";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { StudentsDatabaseProvider } from '../providers/students-database/students-database';
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ScanPage,
    ListPage
  ],
  imports: [

    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ScanPage,
    ListPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
//zelf toegevoegd:

    HttpClient,
    BarcodeScanner,
    StudentsDatabaseProvider,
    HttpClientModule,
    File,
    EmailComposer
  ]
})
export class AppModule {}
