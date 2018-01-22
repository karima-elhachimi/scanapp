import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StudentsDatabaseProvider} from "../../providers/students-database/students-database";

import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';


/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  scannedStudents: any;

  constructor(private email: EmailComposer, private file: File, public studentService: StudentsDatabaseProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.studentService.getScannedStudents().then((data) => {
      this.scannedStudents = data;
    });
    console.log('ionViewDidLoad ListPage');

  }


  //scannedStudents opslaan als csv die dan doorgestuurd kan worden
  saveAsCSV(){

    var csv: any = this.convertToCSV(this.scannedStudents);
    var fileName: any = "scannedstudents.csv";
    this.file.writeFile(this.file.externalRootDirectory, fileName, csv)
      .then(
        _ => {
          alert('student csv created succesfully');
          console.log('student csv created succesfully');
        }
      )
      .catch(
        err => {

          this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv)
            .then(
              _ => {
                alert('student csv created succesfully');
                console.log('student csv created succesfully');
              }
            )
            .catch(
              err => {
                alert('student csv creation failed');
                console.log('student csv creation failed');
              }
            )
        }
      )


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

    return csv
  }

  mailCSV(){

    this.email.isAvailable().then((available: boolean) =>{
      if(available) {
        this.email.open(mail);
      }
    });



    let mail = {
      to: '',
      cc: '',
      bcc: '',
      attachments:
        [this.file.externalRootDirectory+'scannedstudents.csv'],
      subject: 'Gescande studenten.csv',
      body: 'CSV bestand met een lijst van gescande studenten',
      isHtml: true
    };
  }

}
