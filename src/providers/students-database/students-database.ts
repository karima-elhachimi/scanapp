import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

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

  constructor(public http: HttpClient) {
    console.log('Hello StudentsDatabaseProvider Provider');

    //snummers staan in deze database
    this.dbStudentData = new PouchDB('studentdata');

    this.remoteStudents = 'http://127.0.0.1:5984/studentdata';

    let options1 = {
      live: true,
      retry: true,
      continuous: true
    };

    this.dbStudentData.sync(this.remoteStudents, options1);

    //gescande studenten staan hier:
    this.dbScannedStudents= new PouchDB('scannedstudents');

    this.remoteScanned = 'http://127.0.0.1:5984/scannedstudents';

    let options2 = {
      live: true,
      retry: true,
      continuous: true
    };

    this.dbScannedStudents.sync(this.remoteScanned, options2);
  }


  getStudentData(){

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

        this.dbStudentData.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleStudentChange(change);
        });

      }).catch((error) => {

        console.log(error);

      });

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

    this.dbScannedStudents.post(student);
  }

  updateScannedStudents(student){

    this.dbScannedStudents.put(student).catch((err) => {
      console.log(err);
    });

  }

  deleteScannedStudents(student){

    this.dbScannedStudents.remove(student).catch((err) => {
      console.log(err);
    });

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
