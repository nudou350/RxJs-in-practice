import { Observable, observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}
let rxjsLoggingLevel = RxJsLoggingLevel.INFO
export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level
}
export const debug = (level: number, message: string) =>
(sourceObservable: Observable<any>) => sourceObservable.pipe(
    tap(val=>  {
        if(level >= rxjsLoggingLevel){
            console.log(message + ":", val)
        }

    })
)