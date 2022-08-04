import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, from, fromEvent, interval, merge, Observable, of} from 'rxjs';
import {  concatMap, finalize, map, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //concatmap example
    const source1$ = from([1,2,3])
    const source2$ = from([10,10,10])
    //concat makes the observables never complete until the last one is covered and they are all gathered and finally it completes with a new combined observable. order is important
    const combined$ = source1$.pipe(
      concatMap(value => source2$.pipe(map(val => val*value)))
    ).subscribe(console.log)

    const interval1$ = interval(1000).pipe(
      take(3)
    )
    const interval2$ = interval1$.pipe(map(val => val*10))

    //merge gets values emitted by emitting order, so in the end you get a final obs$ with all values emitted in the order they were emitted. If one errors, merge errors out
    const result$ = merge(interval1$, interval2$).subscribe(
      (val)=> console.log(val),
      err => console.log(err),
      () => console.log('completed')
    )

    

    
  }

 

}
