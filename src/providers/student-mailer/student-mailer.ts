import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//added
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { AlertController } from "ionic-angular";

/*
  Generated class for the StudentMailerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudentMailerProvider {

  constructor(private alertCtrl: AlertController, private file: File, private emailComposer: EmailComposer, public http: HttpClient) {
    console.log('Hello StudentMailerProvider Provider');
  }



  presentAlertSucces() {
    let alert = this.alertCtrl.create({
      title: 'File created',
      subTitle: 'The studentlist was created and can be mailed now.',
      buttons: ['Ok']
    });

    alert.present();

  }

  presentAlertFail() {
    let alert = this.alertCtrl.create({
      title: 'Action Failed',
      subTitle: 'The creation of the studentlist file to mail, failed. Try again later.',
      buttons: ['Ok']
    });

    alert.present();

  }


  saveAsCSV(students){

    var csv: any = this.convertToCSV(students);
    var fileName: any = "scannedstudents.csv";
    this.file.writeFile(this.file.externalRootDirectory, fileName, csv)
      .then(
        _ => {
          alert('student csv created succesfully');
          console.log('student csv created succesfully');
          this.presentAlertSucces();
        }
      )
      .catch(
        err => {

          this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv)
            .then(
              _ => {

                console.log('student csv created succesfully');
              }
            )
            .catch(
              err => {

                console.log('student csv creation failed');
              }
            )
        }
      )


  }

  createTextFile(data){
    let text: any = '';

    text +=`<h1>Alle gescande studenten:</h1>`;
    text +=`<table><tr><td>Naam Student</td><td>datum scan studentenkaart</td></tr>`;

    for(let i = 0; i < data.length; i++){
      text +=`<tr><td>${data[i].naam}</td><td>${data[i].timestamp}</td></tr>`;
    }


    text += `</table>`;

    this.presentAlertSucces();
    return text;


  }
  convertToCSV(data) {

    var csv: any = '';
    var line: any = '';

    var col = data[0].length;
    var total = data.length;

    //Header
    for (var i = 0; i < total; i++) {
      if (line != '') line += ';'
      line += "Student " + (i + 1)
    }
    csv += line + '\r\n';

    //Students
    for (let i = 0; i < col; i++) {
      line = '';
      for (let j = 0; j < total; j++) {
        if (line != '') line += ';';

        line += data[j][i]

      }
      csv += line + '\r\n'
    }

    console.log(`created csv file: ${csv}`);
    this.presentAlertSucces();
    return csv
  }

  mailStudents(students, to, cc, bbc, subject ){

    let studentsFile = this.createTextFile(students);

    this.emailComposer.isAvailable().then((available: boolean) =>{
      this.emailComposer.hasPermission().then((isPermitted: boolean) => {

        let mail = {
          app 			: 'mailto',
          to 			: to,
          cc 			: cc,
          bcc 			: bbc,
          attachments 	: [],
          subject 		: subject,
          body 		: studentsFile,
          isHtml: true
        };
        //this.emailComposer.open(mail);
        this.emailComposer.open(mail);

      }).catch((error : any) =>
      {
        console.log('No access permission granted');
        console.dir(error);
      });
    }).catch((error : any) =>
    {
      console.log('User does not appear to have device e-mail account');
      console.dir(error);
    });





  }

}
