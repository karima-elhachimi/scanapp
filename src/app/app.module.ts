//gegenereerd door ionic zelf: tabs //

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// einde gen door ionic //
//zelf toegevoegd: //
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { StudentsDatabaseProvider } from '../providers/students-database/students-database';
import { ListPage } from "../pages/list/list";
import { ScanPage } from "../pages/scan/scan";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ScanPage,
    ListPage
  ],
  imports: [
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
    BarcodeScanner,
    StudentsDatabaseProvider
  ]
})
export class AppModule {}
