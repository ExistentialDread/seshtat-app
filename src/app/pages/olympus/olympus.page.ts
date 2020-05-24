import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { SVG, Svg, G } from '@svgdotjs/svg.js';
import { Subscription } from 'rxjs';
import { Step, StepNode, Path } from '@data/models';
import { AlertService } from '@core/services';
import { StepService } from '@data/services';

import { icons } from '@data/models/step-icons';

@Component({
  selector: 'app-olympus',
  templateUrl: './olympus.page.html',
  styleUrls: ['./olympus.page.scss'],
})
export class OlympusPage implements OnInit, OnDestroy, AfterViewInit {

  subs: Subscription[] = [];

  svg: Svg;
  steps: Step[];
  stepNodes: StepNode[];

  constructor(public alertService: AlertService,
              private stepService: StepService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async ngAfterViewInit() {
    /*
    this.svg = SVG().addTo('#step-tree').size('1000px','1000px');
    this.svg.defs().element('style').words(
      "@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed'); "
          + "@import url('./assets/stepTree/style.css');"
    );

    await this.getSteps();
    this.drawStepTree();
    */
  }

  async getSteps() {
    try {
      this.steps = await this.stepService.getAll();
      this.stepNodes = [];
      this.steps.forEach(step => {
        this.stepNodes.push(new StepNode(step));
      });
    } catch (e) {
      this.alertService.error(e);
    }
  }

  drawStepTree() {
    for(let stepNode of this.stepNodes) {
      this.drawStep(stepNode);
      for(let path of stepNode.step.paths) {
        this.drawPath(stepNode, path);
      }
    }
  }

  drawStep(node: StepNode) {
    node.content = this.svg.group().x(0).y(0);
    // Add outline of the node
    node.content.path("M0 0 H50 V66 L42 74 H0 Z M50 50 H0").attr('class', 'node-outline');
    // Add Selected Indicator path
    node.content.path("M3 8 V3 H8 M47 42 V47 H42").attr('class', 'node-selected-indicator');
    // Add icon text
    node.content.nested().size('50','50').viewbox('-5 -5 60 60').path(icons[node.getIcon()]).attr({'class': ('icon'), x:0, y:50, height:'50px', width: '50px'});
    // Add const
    node.content.plain('' + node.getAdvancement()).attr({'class': 'cost', x:25,y:68});

    // Position the node
    node.content.translate(node.getX(), node.getY());

    // Style the node
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
      const arrowG = node.content.group();
      arrowG.path("M25 75 l5 5 h-10 Z").addClass('edge-arrow')
      arrowG.path("M25 80 v15").addClass('edge-end');
      node.paths.push(arrowG);
    }

    // Node behaviour
    node.content.click(() => {
      // this.selectNode(node);
      console.log(node);
    });
  }

  drawPath(node: StepNode, path: Path[]) {
    // Move to the start of the node
    let pathString:string = "M" + (node.getX()+25) + " " + (node.getY());
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
}
