import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class VideoSourceService {

    constructor(private http: HttpClient) { }

    publishtoCloud(imgdata: string): Observable<any> {
        return this.http.post('http://localhost:8080/upload', {'imgdata': imgdata});
    }
}