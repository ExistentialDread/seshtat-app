import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-color-pick',
  templateUrl: './color-pick.page.html',
  styleUrls: ['./color-pick.page.scss'],
})
export class ColorPickPage implements OnInit {

   public colors: string[] = [

    // great
    '#518802',
    '#4caf50',
    '#388e3c',
    '#009688',
    '#00796b',

    // good
    '#519c6f',
    '#cddc36',
    '#8bc34a',
    '#afb42b',
    '#689f38',

    // meh
    '#5c6a6f',
    '#7c90c1',
    '#43A0D4', //'#536dfe',
    '#a367b5',
    '#4e0a77',

    // bad
    '#e87219',
    '#f0b89a',
    '#ff9800',
    '#ff5722',
    '#e64a19',

    // awful
    '#cd6a6f',
    '#d63d62',
    '#ee3e6d',
    '#F01630', //'#8e0622',
    '#cf0500',
  ];

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  setColor(color:string) {
    this.popoverCtrl.dismiss(color);
  }

}
