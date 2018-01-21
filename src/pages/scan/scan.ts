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
  scanResults: {};

  constructor(private barcodeScanner: BarcodeScanner, public studentService: StudentsDatabaseProvider,  public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.studentService.getStudentData().then((data) => {
      console.log(`student data from studentservice getstudentdata: ${data[0].naam}`);

      this.sdata = data;


    });
    console.log('ionViewDidLoad ScanPage');
  }

  async scanStudentCard(){

    this.scanResults = await this.barcodeScanner.scan();


    console.log(`Scanned card was: ${this.scanResults}`);
  }

  addScannedStudentCard(){

    let scannedStudent = this.findStudent(this.scanResults.text);
    this.studentService.createScannedStudent(scannedStudent);


  }

  findStudent(snr){

    let student: any;

    for(let i = 0; i < this.sdata.length; i++) {
      if (snr == this.sdata[i].snr) {
        student = this.sdata[i];
      }
      else
        student = null;

    }

    return student;

  }


}
