import { Component, NgModule, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { VideoSourceService } from './video-source.service';

@Component({
  selector: 'app-video-source',
  templateUrl: './video-source.component.html',
  styleUrls: ['./video-source.component.scss']
})

@NgModule({
  providers: [VideoSourceService],
})

export class VideoSourceComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('video1', { static: true }) video1Element: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  faceUser = true;
  divContent: string;
  width = 600;
  height = 300;
  videoWidth = 0;
  videoHeight = 0;
  stream = null;
  imgData = '';

  constructor(private renderer: Renderer2, private service: VideoSourceService) { }

  ngOnInit() {
    var supports = navigator.mediaDevices.getSupportedConstraints();
    if (!supports['facingMode']) {
      this.faceUser = false;
    }
    this.startCamera();
  }

  upload() {
    this.service.publishtoCloud(this.imgData);
  }

  startCamera() {
    var constraints = {
      video: {
        facingMode: this.faceUser ? "user" : "environment",
        width: { ideal: this.width },
        height: { ideal: this.height }
      }
    };

    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  attachVideo(_stream) {
    this.stream = _stream;
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', _stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });

    //Just for screen view puropse
    this.renderer.setProperty(this.video1Element.nativeElement, 'srcObject', _stream);
    this.renderer.listen(this.video1Element.nativeElement, 'play', (event) => {
      this.videoHeight = this.video1Element.nativeElement.videoHeight;
      this.videoWidth = this.video1Element.nativeElement.videoWidth;
    });
  }

  flipCam() {
    if (this.stream == null) return;
    this.stream.getTracks().forEach(e => {
      e.stop();
    });
    this.faceUser = !this.faceUser;
    this.startCamera();
  }

  capture() {
    //Draw the image into the canvas
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, this.width, this.height);

    //Get the image of the canvas
    var imageCanvas = <HTMLCanvasElement>document.getElementById("can");
    document.getElementById("output-wrap").classList.remove("d-none");
    document.getElementById("upload").classList.remove("d-none");

    //Get image data with increased img quality(from default 0.92 to 1 - best quality)
    this.imgData = imageCanvas.toDataURL("image/png", 1.0);

    document.getElementById("output").innerHTML = '<img src="' + this.imgData + '"/><br><img src="' + this.imgData + '" style="transform:rotateY(180deg) rotateX(180deg)"/>';

    //TODO rotate context instead of image and combine canvas into one
    //------------------------------------------------------------------
    // cxtt.translate(this.width, this.height);
    // cxtt.rotate(Math.PI);
    //document.getElementById("output").focus({ preventScroll: false });

    //TODO combine two canvas, second canvas need to be rotated and appended with new canvas

    // html2canvas(document.getElementById('output')).then(function (d) {
    //     var context = d.getContext("2d");
    //     var img = new Image();
    //     img.src = c.toDataURL("image/png", 1.0);
    //     context.drawImage(img, 0, 0);
    //     var img = new Image();
    //     img.src = c1.toDataURL("image/png", 1.0);
    //     context.drawImage(img, 0, 0);

    //     var imgData = d.toDataURL("image/png", 1.0);
    //     document.getElementById("output").innerHTML = '<img src="' + imgData + '" width="this.width" height="800"/>';
    // });

    // var can2 = <HTMLCanvasElement>document.getElementById("can2")
    // var cxt = can2.getContext('2d');
    // cxt.drawImage(c, 0, 0, this.width, this.height);
    // this.renderer.setStyle(can2.nativeElement, 'transform', 'rotateY(180deg) rotateX(180deg)');
    // cxt.drawImage(c1, 0, this.height, this.width, this.height);
    // document.getElementById("output").innerHTML = '<img src="' + can2.toDataURL("image/png") + '"/>';
  }

  // captureWithRotate() {
  //     // this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, this.width, this.height);
  //     // var c = <HTMLCanvasElement>document.getElementById("can");
  //     var img = new Image();
  //     img.width = this.width;
  //     img.height = this.height;
  //     var canvas = <HTMLCanvasElement>document.getElementById('can');
  //     var ctx = canvas.getContext('2d');
  //     ctx.save();
  //     ctx.scale(-1, -1);
  //     ctx.drawImage(img, this.width * -1, this.height * -1, this.width, this.height);
  //     ctx.restore();
  //     var img1 = canvas.toDataURL("image/png", 1.0);
  //     document.getElementById("output").innerHTML = '<img src="' + img1 + '"/>';
  // }

  handleError(error) {
    console.log('Error: ', error);
  }
}
