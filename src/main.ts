import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Form</h1>
    <div [formGroup]="profileForm" >
      <div>
        <input type="text" placeholder="Username" formControlName="username" />
      </div>
      <div>
        <input type="password" placeholder="Password" formControlName="password" />
      </div>
      <div formGroupName="address">
        <h3>Address</h3>
        <div>
          <input type="text" placeholder="Street" formControlName="street" />
        </div>
        <div>
          <input type="text" placeholder="City" formControlName="city" />
        </div>
        <div>
          <input type="text" placeholder="State" formControlName="state" />
        </div>
        <div>
          <input type="text" placeholder="Zip Code" formControlName="zip" />
        </div>
      </div>
      <div formGroupName="dateTimeValid">
        <h3>Date-Time</h3>
        <div>
          <input type="date" placeholder="Start Date" formControlName="startDate" />
        </div>
        <div>
          <input type="date" placeholder="End Date" formControlName="endDate" />
        </div>
        <div>
          <input type="time" placeholder="Start Time" formControlName="startTime" />
        </div>
        <div>
          <input type="time" placeholder="End Time" formControlName="endTime" />
        </div>
      </div>
      <br />
      <button type="submit" (click)="onSave()" [disabled]="!profileForm.valid" >Submit</button>

      <div *ngIf="profileForm.errors?.invalidPeriod">Start datetime must be before the end datetime.</div>

      <h2>Result:</h2>
      <pre><p>{{profileForm.value | json}}</p></pre>
    </div>
  `,
})
export class App {
  profileForm = this.fb.group({
    username: [
      '',
      { validators: [Validators.required, Validators.minLength(2)] },
    ],
    password: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
    dateTimeValid: this.fb.group(
      {
        startDate: [''],
        endDate: [''],
        startTime: [''],
        endTime: [''],
      },
      { validators: [this.dateValidator, Validators.required] }
    ),
  });
  constructor(private fb: FormBuilder) {}

  onSave(): void {
    console.log(this.profileForm);
  }

  dateValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = new Date(group.get('startDate')!.value);
    const endDate = new Date(group.get('endDate')!.value);

    const startHour = group.get('startTime')!.value;
    const endHour = group.get('endTime')!.value;

    const [startHourParsed, startMinutesParsed] = startHour.split(':');
    const [endHourParsed, endMinutesParsed] = endHour.split(':');

    startDate.setHours(parseInt(startHourParsed), parseInt(startMinutesParsed));
    endDate.setHours(parseInt(endHourParsed), parseInt(endMinutesParsed));

    return startDate > endDate ? { invalidPeriod: true } : null;
  }
}

bootstrapApplication(App);
