import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, Subject, throwError, timer} from 'rxjs';
import {catchError, delayWhen, filter, map, retry, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnersCourses$ : Observable<Course[]>
    advancedCourses$ : Observable<Course[]>


    constructor(private http: HttpClient) {

    }

    ngOnInit() {
        //reactive way
        const courses$ = this.http.get("api/courses").pipe(
            map(courses => courses["payload"]),
            //reduces from 2 calls into 1 call by using shareReplay and reusing the data already fetched
            shareReplay(),
            catchError(err => {
                console.log(err)
                alert('something occured')
                return throwError(err)
            }),
            retryWhen(errors => errors.pipe(
                delayWhen(() => timer(2000))
            )))
        this.beginnersCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category=="BEGINNER"))
        )
        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category=="ADVANCED"))
        )


        //imperative way

        // const http$ = createHttpObservable('/api/courses')
        // const courses$ = http$.pipe(
        //     map(res => Object.values(res["payload"]))
        // )

        // courses$.subscribe(courses => {
        //     this.beginnersCourses = courses.filter(course=> course.category == "BEGINNER")
        //     this.advancedCourses = courses.filter(course=> course.category == "ADVANCED")
        //     console.log(this.beginnersCourses)
        //     console.log(this.advancedCourses)
        // })
        

    }

}
