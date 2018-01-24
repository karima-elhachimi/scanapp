import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner} from "@ionic-native/barcode-scanner";

import { StudentsDatabaseProvider } from "../../providers/students-database/students-database";


/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {


  sdata: any;
  scannedStudent: {};
  scanResults: {};
  promiseDone: boolean = false;
  found: boolean = false;

  constructor(private barcodeScanner: BarcodeScanner, public studentService: StudentsDatabaseProvider,  public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    //this.studentService.getStudentDataSync();
    this.getAllStudents();

    console.log('ionViewDidLoad ScanPage');
  }

  async getAllStudents(){

    await this.studentService.getStudentDataAsync();
    this.promiseDone = true;
    this.sdata = this.studentService.studentdata;
  }


  async scanStudentCard(){

    await this.getAllStudents();
    await this.barcodeScanner.scan().then((result)=>{


      if(!result.cancelled) {
        this.findStudent(result);
        if(this.found) {
          this.scanResults = result;
          this.studentService.createScannedStudent(this.scannedStudent);
        }
      }


    }, (error) => {

      console.log(`Scanning failed ${error}`);
      this.scanResults = false;

    });




  }



  findStudent(snrtofind){
//S000005612963
    let snr: any = snrtofind.text.slice(6, 11);
    this.found = false;

    console.log(`splice van snr uit scan: ${snr} en origineel was het: ${snrtofind.text}`);

    for(let s of this.studentService.studentdata){
      if(s.snr == snr){
        console.log(`matched! snr: ${s.snr} naam: ${s.naam}`);
        this.scannedStudent = s;
        this.found = true;
      }



    }

    if(!this.found)
      this.studentService.presentAlertFailed();

  }




}
