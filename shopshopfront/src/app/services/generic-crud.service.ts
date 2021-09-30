import { Injectable } from '@angular/core';
import { retry, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ICrud} from './ICrud';

const httpOptions = {
  headers : new HttpHeaders({
    'content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export abstract class GenericCrudService<T, ID> implements ICrud<T, ID>{

  constructor(private http: HttpClient, private url: string){}

  public save(t: T): Observable<T>{
    return this.http.post<T>(this.url, t, httpOptions);
  }

  public findAll(): Observable<T[]>{
    return this.http.get<T[]>(this.url, httpOptions).pipe(
      retry(3),
      shareReplay()
    );
  }

  public findById(id: ID): Observable<T>{
    return this.http.get<T>(`${this.url}/${id}`, httpOptions).pipe(
      retry(3),
      shareReplay()
    );
  }

  public update(id: ID, t: T): Observable<T>{
    return this.http.put<T>(`${this.url}/${id}`, JSON.stringify(t), httpOptions).pipe(
      retry(3),
      shareReplay()
    );
  }

  public deleteById(id: ID): Observable<T>{
    return this.http.delete<T>(`${this.url}/${id}`, httpOptions).pipe(
      retry(3),
      shareReplay()
    );
  }
}
