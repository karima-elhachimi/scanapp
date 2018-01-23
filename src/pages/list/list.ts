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
  s

}
