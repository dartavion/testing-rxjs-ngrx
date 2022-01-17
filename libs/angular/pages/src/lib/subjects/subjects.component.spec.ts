import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SubjectsComponent } from './subjects.component';
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';

describe('SubjectsComponent', () => {
  let spectator: Spectator<SubjectsComponent>;
  let testScheduler: TestScheduler;
  const createComponent = createComponentFactory(SubjectsComponent);

  beforeEach(() => testScheduler =
    new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    )
  );

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  // Example subject testing
  it('has a subject', () => {
    testScheduler.run(({expectObservable}) => {
      const actual = spectator.component.people$;
      const marbles = '';
      const expected = '';
      expectObservable(actual).toBe(marbles, expected);
    });
  });

  it('is a person subject', () => {
    testScheduler.run(({cold, expectObservable, expectSubscriptions}) => {
      const actual = spectator.component.people$;
      const marbles = '100ms a|';
      const subs = cold(marbles);
      const expected = {a: true};
      // Destroy component on complete
      subs.subscribe(() => {
        spectator.component.isAPerson(true)
      }, jest.fn, () => spectator.fixture.destroy());
      expectObservable(actual).toBe(marbles, expected);
      // Verify subscription and destruction
      expectSubscriptions(subs.subscriptions).toBe('   ^  100ms  !');
    });
  });

  // Example of async usage
  it('has an error', fakeAsync(() => {
    testScheduler.run(({cold, expectObservable}) => {
      const errorMessage = new Error('this has errored message')
      const actual = spectator.component.people$;
      const marbles = '1ms 0 #';
      const subs = cold(marbles);
      subs.subscribe(
        () => spectator.component.isAPerson(false),
        (err) => expect(err).toBe('error')
      );
      // Notice the difference in the marbles timing
      // The marbles above uses 2 frames where the expectObservable uses 1 frame
      // Since the focus is on the error message in the 3rd argument we want to target that.
      // Timing in these strings ie. '12ms ab 200ms c' or '----a-b-(cd)|' is something to play with and understand
      expectObservable(actual).toBe('1ms #', {}, errorMessage);
    });
    // tick();
    // flush();
    // flushMicrotasks();
    // discardPeriodicTasks();
    // Event Loop: https://javascript.info/event-loop
    // JavaScript Tasks are queued up in an event loop.
    // A JavaScript task is any code that starts an app or is a callback or interval etc.
    // MicroTasks are different from Tasks in that they exist in a different queue that runs after a code block completes.
    // MicroTasks that are created by other MicroTasks are also completed before moving onto the next Task
    // PeriodicTasks
  }));
  // Example stream testing
  it('generates the stream correctly', () => {
    testScheduler.run(({ expectObservable }) => {
      const source =  of(1, 2, 3, 2, 3, 1);
      const toggle = spectator.component.toggle();
      const result = source.pipe(toggle);

      expectObservable(result).toBe(
        '(abcdef|)',
        {a:[1], b:[1,2], c:[1,2,3], d:[1,3], e:[1], f:[]}
      );
    });
  });
});
