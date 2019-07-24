import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class EventService{
    constructor( private http: HttpClient){
    }

    getEventList() : Observable<any>{
        return this.http.get(environment.baseAPIUrl + '/assets/data.json');
    }
}