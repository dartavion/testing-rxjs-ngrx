import { Component, OnDestroy } from '@angular/core';
import { iif, of, pipe, Subject, throwError } from 'rxjs';
import { mergeMap, scan, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'angular-patterns-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnDestroy {
  private destroy$ = new Subject();
  private people = new Subject<boolean>();
  people$ = this.people.asObservable()
    .pipe(
      takeUntil(this.destroy$),
      tap(console.log),
      mergeMap((data) =>
         data
           ? of(data)
           : throwError(new Error('this has errored message'))
       )
      );

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  isAPerson(value: boolean) {
    this.people.next(value);
  }

  toggle () {
    return pipe(
      scan((acc: number[], value: number) => {
        const found = acc.indexOf(value) > -1;
        if (found) {
          return acc.filter(v => v !== value);
        } else {
          return [...acc, value];
        }
      }, [])
    );
  }
}
