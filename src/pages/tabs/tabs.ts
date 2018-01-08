import { Component } from '@angular/core';


import { HomePage } from '../home/home';
import {ScanPage} from "../scan/scan";
import { ListPage} from "../list/list";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ScanPage;
  tab3Root = ListPage;

  constructor() {

  }
}
