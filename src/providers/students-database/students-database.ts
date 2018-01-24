import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';
import { AlertController } from "ionic-angular";

/*
  Generated class for the StudentsDatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudentsDatabaseProvider {

  studentdata: any;
  scanneddata: any;

  dbStudentData: any;
  dbScannedStudents: any;
  remoteStudents: any;
  remoteScanned: any;


  cloudantStudents: any;
  cloudantScans: any;

  constructor(private alertCtrl: AlertController, public http: HttpClient) {
    console.log('Hello StudentsDatabaseProvider Provider');

    //snummers staan in deze database
    this.dbStudentData = new PouchDB('https://66420596-e8b3-4761-af06-bb0b3be9e0a6-bluemix.cloudant.com/snummers');

    //this.remoteStudents = 'https://66420596-e8b3-4761-af06-bb0b3be9e0a6-bluemix.cloudant.com/snummers';






    /*let options1 = {
      live: true,
      retry: true,
      continuous: true
    };*/

    //this.dbStudentData.sync(this.remoteStudents, options1);

    //gescande studenten staan hier:
    this.dbScannedStudents= new PouchDB('scannedstudents');

    this.remoteScanned = 'https://66420596-e8b3-4761-af06-bb0b3be9e0a6-bluemix.cloudant.com/scannedstudents';

    let options2 = {
      live: true,
      retry: true,
      continuous: true
    };

    this.dbScannedStudents.sync(this.remoteScanned, options2);
  } //einde constructor

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Student opgeslagen',
      subTitle: 'De gescande studentenkaart is opgeslagen.',
      buttons: ['Ok']
    });

    alert.present();

  }

  presentAlertFailed(){
    let alert = this.alertCtrl.create({
      title: 'Studentnummer fout',
      subTitle: 'De gescande studentenkaart wordt niet herkend.',
      buttons: ['Ok']

    });

    alert.present();
  }


  getStudentDataAsync(){

    if(this.studentdata){
      return Promise.resolve(this.studentdata);
    }

    return new Promise(resolve => {

      this.dbStudentData.allDocs({

        include_docs: true

      }).then((result) => {

        this.studentdata = [];
        result.rows.map((row) => {
          this.studentdata.push(row.doc);
        });
        resolve(this.studentdata);
        console.log("studentdata in service is resolved");
        //let cloudantStudentsUrl = `https://66420596-e8b3-4761-af06-bb0b3be9e0a6-bluemix:46397236f2160349fae89be8a3386ec5628d119f346a8d248482e777c534e723@66420596-e8b3-4761-af06-bb0b3be9e0a6-bluemix.cloudant.com`;


        this.dbStudentData.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleStudentChange(change);
        });

      }).catch((error) => {

        console.log("getting student data failed"+ error);

      });

    });
  }

  getStudentDataSync(){
    this.dbStudentData.allDocs({include_docs:true},(err,resp)=>{
      console.log(`get All docs sync: ${resp.rows}`);
    });
  }

  getScannedStudents(){

    if(this.scanneddata){
      return Promise.resolve(this.scanneddata);
    }

    return new Promise(resolve => {

      this.dbScannedStudents.allDocs({

        include_docs: true

      }).then((result) => {

        this.scanneddata = [];

        result.rows.map((row) => {
          this.scanneddata.push(row.doc);
        });

        resolve(this.scanneddata);

        this.dbScannedStudents.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleScannedChange(change);
        });

      }).catch((error) => {

        console.log(error);

      });

    });



  }

  createScannedStudent(student){


    student.timestamp = new Date().toString();


    let doc= {
      'naam': student.naam,
      'snr': student.snr,
      'timestamp': new Date().toString()
    };


    this.dbScannedStudents.post(doc, function (err, response) {
      if (err) { return console.log(err); }
      // handle response
      console.log(`student was posted: ${response}`);
    });

    this.presentAlert();
  }

  updateScannedStudents(student){

    this.dbScannedStudents.put(student).catch((err) => {
      console.log(err);
    });

  }

  deleteScannedStudents(){

    for(let i = 0; i < this.scanneddata; i++){
      this.dbScannedStudents.remove(this.scanneddata[i]).catch((err) => {
        console.log(err);
      });
    }


  }

  handleStudentChange(change){

    let changedDoc = null;
    let changedIndex = null;

    this.studentdata.forEach((doc, index) => {

      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }

    });

    //A document was deleted
    if(change.deleted){
      this.studentdata.splice(changedIndex, 1);
    }
    else {

      //A document was updated
      if(changedDoc){
        this.studentdata[changedIndex] = change.doc;
      }

      //A document was added
      else {
        this.studentdata.push(change.doc);
      }

    }
  }

  handleScannedChange(change){

    let changedDoc = null;
    let changedIndex = null;

    this.scanneddata.forEach((doc, index) => {

      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }

    });

    //A document was deleted
    if(change.deleted){
      this.scanneddata.splice(changedIndex, 1);
    }
    else {

      //A document was updated
      if(changedDoc){
        this.scanneddata[changedIndex] = change.doc;
      }

      //A document was added
      else {
        this.scanneddata.push(change.doc);
      }

    }
  }

}
