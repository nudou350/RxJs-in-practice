import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, exhaustMap
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, of, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { HttpClient } from '@angular/common/http';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId : string

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute, private http: HttpClient) {

    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];
        this.course$ = this.http.get<Course>(`api/courses/${this.courseId}`).pipe(debug(RxJsLoggingLevel.INFO, "course value "))
        //forkjoin example

        // const courseForkJoin$ = this.http.get<Course>(`api/courses/${this.courseId}`).pipe(debug(RxJsLoggingLevel.INFO, "course value "))
        // const lessonsForkJoin$ = this.loadLessons()
        // forkJoin(courseForkJoin$, lessonsForkJoin$).pipe(tap(([courses, lessons]) => {
        //     console.log("courses FK", courses)
        //     console.log("lessons FK", lessons)
        // })).subscribe(console.log)
        setRxJsLoggingLevel(RxJsLoggingLevel.TRACE)
    }

    ngAfterViewInit() {       
        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
            debounceTime(300),
            map(event => event.target.value),
            startWith(''),
            debug(RxJsLoggingLevel.TRACE, "search"),
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search)),
            debug(RxJsLoggingLevel.DEBUG, "lesson value")
        )
    }

    loadLessons(search = '') : Observable<Lesson[]>{
        return this.http.get<Lesson[]>(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
            map(val => val["payload"]),
            shareReplay()
        )
    }


}
