import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {from, fromEvent, interval} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, finalize, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {

        // this.form.valueChanges.pipe(
        //     filter(()=>this.form.valid),
        //     mergeMap(changes => this.saveCourse(changes))
        // ).subscribe()

    }



    ngAfterViewInit() {

       const test= fromEvent(this.saveButton.nativeElement, 'click').pipe(
            //waits until each click completed and then process the new ones in order : concatMap(changes => this.saveCourse(this.form.value))
            //exhaust ignores any clicks tha occur while processing the query
            exhaustMap(()=>  this.saveCourse(this.form.value),
            )
        ).subscribe()

    }

    saveCourse(changes){
        return from(fetch(`api/courses/${this.course.id}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type' : 'application/json'
            }
        }))
    }



    close() {
        this.dialogRef.close();
    }

}
