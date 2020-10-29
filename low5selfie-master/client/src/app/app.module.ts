import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { VideoSourceComponent } from './video-source/video-source.component';
import { VideoSourceService } from './video-source/video-source.service';

@NgModule({
  declarations: [
    AppComponent,
    VideoSourceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [VideoSourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
