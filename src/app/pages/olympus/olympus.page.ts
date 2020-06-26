import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { SVG, Svg } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';

import { Subscription } from 'rxjs';
import { Step, StepNode, Path, Mountain } from '@data/models';
import { AlertService, NavigationService } from '@core/services';
import { StepService } from '@data/services';
import { ModalController } from '@ionic/angular';
import { StepDetailsPage, MountainsPage } from 'src/app/modals/mountain';

@Component({
  selector: 'app-olympus',
  templateUrl: './olympus.page.html',
  styleUrls: ['./olympus.page.scss'],
})
export class OlympusPage implements OnInit, OnDestroy, AfterViewInit {

  subs: Subscription[] = [];

  svg: any;
  steps: Step[];
  stepNodes: StepNode[] = [];
  zoomLvl = 0.75;
  menuActivated = true;

  mountains: Mountain[];

  constructor(public alertService: AlertService,
              private stepService: StepService,
              public navigationService: NavigationService,
              private modalCtrl: ModalController) { }

  async ngOnInit() {
    try {
      this.mountains = await this.stepService.getAllMountains();
      this.mountains.forEach(mountain => {
        mountain.selected = true;
      });
    } catch (err) {
      this.alertService.error(err);
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async ngAfterViewInit() {

    this.initSVG();

    await this.getSteps();
    await this.drawStepTree();
  }

  initSVG(clear = false) {
    if(!clear) {
      this.svg = SVG().addTo('#step-tree').size('100%','100%').viewbox('0 0 2000 1500').panZoom({ zoomMin: 0.25, zoomMax: 2});
      this.svg.defs().element('style').words(
        "@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed'); "
            + "@import url('./assets/stepTree/style.css');"
      );
    } else {
      this.svg.clear();
    }
  }

  zoom(zoom: boolean) {
    if(zoom) {
      this.zoomLvl+=0.25;
      this.zoomLvl = this.zoomLvl > 2 ? 2 : this.zoomLvl;
    } else {
      this.zoomLvl -= 0.25;
      this.zoomLvl = this.zoomLvl < 0.25 ? 0.25 : this.zoomLvl;
    }
    this.svg.zoom(this.zoomLvl);
    this.menuActivated = true;
      
  }
  reset() {
    this.svg.zoom(1, {x: 0, y: 0});
  }


  async getSteps() {
    try {
      this.steps = await this.stepService.getAll();
      this.steps.forEach(step => {
        this.stepNodes.push(new StepNode(step));
      });
    } catch (e) {
      this.alertService.error(e);
    }
  }

  async drawStepTree() {
    for(let stepNode of this.stepNodes) {
      this.drawStep(stepNode);
    }
  }

  async drawStep(node: StepNode) {
    if(node.content) {
      node.content.clear();
    }
    node.content = this.svg.group().x(0).y(0).click((event) => {
      this.openStepDetails(node.step, node);
    });
    node.content.clear();
    // Add outline of the node
    node.content.path("M0 0 h50 v66 l-8 8 H0 Z M50 50 H0").attr('class', 'node-outline');
    // Add Selected Indicator path
    node.content.path("M3 8 V3 H8 M47 42 V47 H42").attr('class', 'node-selected-indicator');
    // Add icon text
    try {
      const icon = await this.stepService.loadIcon(node.getIcon());
      node.content.nested().svg(icon).addClass('icon').children()[0].attr({height: "46", x:0, y:2});
    } catch (ex) {
      console.log(ex);
    }
    // Add cost
    node.content.plain('' + node.getAdvancement()).attr({'class': 'cost', x:25,y:68});

    // Position the node
    node.content.translate(node.getX(), node.getY());

    // Style the node
    node.content.removeClass('locked');
    node.content.removeClass('inprogress');
    node.content.removeClass('done');
    node.content.removeClass('god');
    node.content.addClass('node');
    if(node.isDone()) {
      node.content.addClass('done');
    } else if(node.isLocked()) {
      node.content.addClass('locked');
    } else {
      node.content.addClass('inprogress');
    }
    if(node.isGod()) {
      node.content.addClass('god');
    }

    // draw arrow in
    if(!node.step.isLeaf) {
      let arrowG = node.content.group();
      arrowG.path("M25 75 l5 5 h-10 Z").addClass('edge-arrow');
      arrowG.path("M25 80 v15").addClass('edge-end');
    }

    for(let path of node.step.paths) {
      this.drawPath(node, path);
    }
  }

  drawPath(node: StepNode, path: Path[]) {
    node.paths.forEach(p => p.remove());

    // Move to the start of the node
    let pathString:string = "M" + (node.getX()+25) + " " + (node.getY()-1);
    // creat a small edge as the begining
    pathString += " v-15";

    // Compute other points
    for(let pt of path) {
      let ptX:number = node.getXofCol(pt.col) + 25;
      let ptY:number = node.getYofRow(pt.row) + 95;

      pathString += " L" + ptX + " " + ptY;
    }

    // Create the path group
    let pathGroup = this.svg.group().addClass('edge');

    if(node.isDone()) {
      pathGroup.addClass('done');
    } else if(node.isLocked()) {
      pathGroup.addClass('locked');
    } else {
      pathGroup.addClass('inprogress');
    }
    // Draw path
    pathGroup.path(pathString);
    // Style the path
    if(!node.isDone()) {
      pathGroup.addClass('locked');
    }
    // Add the path group to the node
    node.paths.push(pathGroup);
  }



  async openMountainsModal() {
    const mountains = this.mountains;
    const modal = await this.modalCtrl.create({
      component: MountainsPage,
      componentProps: {
        mountains
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(async changed => {
      if(changed.data == this.navigationService.RETURN_CODE.DELETED) {
        // need to redraw if a mountain was deleted
        this.initSVG();
        await this.getSteps();
        await this.drawStepTree();
      }
    })
    await modal.present();
  }

  async openStepDetails(step?: Step, node?: StepNode) {
    if(this.mountains.length == 0) {
      await this.openMountainsModal();
      return;
    }
    const modal = await this.modalCtrl.create({
      component: StepDetailsPage,
      componentProps: {
        step,
        mountains: this.mountains
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if(step) { // we are updating a step
        this.drawStep(node);
      } else { // a new step
        if(changed.data) {
          console.log(changed.data);
          const newNode = new StepNode(changed.data);
          this.stepNodes.push(newNode);
          this.drawStep(newNode);
        }

      }

    });
    await modal.present();
  }

  toggleMountain(selected: boolean, mountain: Mountain) {
    mountain.selected = !selected;
  }
}
