import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  private circleMinRadius: number = 10;
  private circleMaxRadius: number = 20;
  private curcleMargin: number = 30;
  private circleMinDist: number = 50;
  private lineMaxDist: number = 150;

  private allCircles: Circle[] = [];
  private nowAllowedRects: Rect[] = [];

  @ViewChild('myCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  constructor(){
    this.fillNotAllowedRects();
  }


  ngAfterViewInit() {
    this.initCanvas();
    this.drawCircles(50);
    this.drawLines();
  }

  fillNotAllowedRects(){
    var rectLogo = new Rect();
    rectLogo.x = 0;
    rectLogo.y = 0;
    rectLogo.width = 0.15 * window.innerWidth;
    rectLogo.height = rectLogo.width / 1.46;
    this.nowAllowedRects.push(rectLogo);

    var widthPercent = 0.8;
    var withMax = 700;
    var heightPercent = 0.7;
    var heightMax = 600;
    var rectContentWidth = window.innerWidth * widthPercent;
    var rectContentHeight = window.innerHeight * heightPercent;
    rectContentWidth = Math.min(rectContentWidth, withMax);
    rectContentHeight = Math.min(rectContentHeight, heightMax);

    var rectContent = new Rect();
    rectContent.x = window.innerWidth / 2 - rectContentWidth / 2;
    rectContent.y = window.innerHeight / 2 - rectContentHeight / 2;
    rectContent.width = rectContentWidth;
    rectContent.height = rectContentHeight;

    this.nowAllowedRects.push(rectContent);
  }

  initCanvas(){
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
  
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;

    context.shadowBlur = 0;
    context.shadowColor = "red";
  }

  drawCircles(count){
    this.allCircles = [];

    for(let i = 0; i < count; i++){
      var circle = this.getRandomCircle();
      while(!this.isCircleAllowed(circle)){
        circle = this.getRandomCircle();
      }

      this.allCircles.push(circle)

      this.drawCircle(circle);
    }
  }

  getRandomCircle(){
    var maxWith = window.innerWidth - 2 * this.curcleMargin;
    var maxHeigh = window.innerHeight - 2 * this.curcleMargin;
    var minRadius = this.circleMinRadius;
    var maxRadius = this.circleMaxRadius;

    var circle = new Circle();
    circle.x = Math.floor(this.curcleMargin + Math.random() * maxWith);
    circle.y = Math.floor(this.curcleMargin + Math.random() * maxHeigh);
    circle.radius = Math.floor(minRadius + Math.random() * (maxRadius-minRadius));

    return circle;
  }

  isCircleAllowed(newC){
    for(let c of this.allCircles){
      var dist = Math.sqrt(Math.pow(c.x - newC.x, 2) + Math.pow(c.y - newC.y, 2));  
      if(dist < this.circleMinDist){
        return false;
      }
    }
    for(let r of this.nowAllowedRects){
      if(this.isCircleInRect(newC, r)){
        return false;
      }
    }
    return true;
  }

  isCircleInRect(c: Circle, r: Rect){
    if(c.x > r.x && c.x < r.x + r.width){
      if(c.y > r.y && c.y < r.y + r.height){
        return true;
      }
      return false;
    }
    return false;
  }

  drawCircle(circle) {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    context.fillStyle = '#3B3BCC';
    context.fill();
    context.closePath();
  }

  drawLines(){
    for(let start of this.allCircles){
      for(let end of this.allCircles){
        var dist = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));  
        if(dist < this.lineMaxDist){
          this.drawLine(start.x, start.y, end.x, end.y);
        }
      }
    }
  }

  drawLine(startX, starty, endX, endY){
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.moveTo(startX, starty);
    context.lineTo(endX, endY);
    context.strokeStyle = "#3B3BCC";
    context.stroke();
  }
}

class Circle{
  x: number;
  y: number;
  radius: number;
}

class Rect{
  x: number;
  y: number;
  width: number;
  height: number;
}