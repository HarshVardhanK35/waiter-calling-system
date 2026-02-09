// import { inject, Injectable } from '@angular/core';
// import { interval, Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';

// @Injectable({
//   providedIn: 'root',
// })
// export class AlarmService {
//   private stopAlarm$ = new Subject<void>();
//   private isRunning = false;

//   // constructor(private toastr: ToastrService) { }
//   private toastr = inject(ToastrService)

//   startAlarm(): void {
//     // console.log("setAlarm() called");
//     if (this.isRunning) {
//       return;
//     }

//     this.isRunning = true;

//     interval(2500)
//       .pipe(takeUntil(this.stopAlarm$))
//       .subscribe(() => {
//         console.log('Toast trigger...');
//         this.toastr.warning(
//           'A table is calling',
//           'Waiter Call',
//           {
//             timeOut: 0,
//             closeButton: true,
//             progressBar: true,
//           }
//         );
//       });
//   }

//   stopAlarm(): void {
//     if (!this.isRunning) {
//       return;
//     }
//     this.stopAlarm$.next();
//     this.isRunning = false;
//   }
// }
