import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-event-booking',
  templateUrl: './event-booking.component.html',
  styleUrls: ['./event-booking.component.css']
})
export class EventBookingComponent implements OnInit {
  selectedEvent;
  bookingForm;
  invalidSeatsFlag = false;
  formSubmitted = false;
  ticketsBookedFlag = false;
  attendees: FormArray;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.eventService.getEventList().subscribe(res => {
      if (res && res.events) {
        this.selectedEvent = res.events.filter((event, index) => {
          return event.id == id;
        });
        this.selectedEvent = this.selectedEvent[0];
      }
    });

    this.createForm();
  }

  createForm() {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      phone_number: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      no_of_seats: ['', Validators.required],
      attendees: new FormArray([])
    });
  }

  getFormControl(key) {
    return this.bookingForm.get(key);
  }

  onSeatsChange(seats) {
    if (seats > this.selectedEvent.no_of_seats) {
      this.invalidSeatsFlag = true;
    }
    if (this.attendees) {
      while (this.attendees.length !== 0) {
        this.attendees.removeAt(0);
      }
    }
    if (seats > 1) {
      this.attendees = this.bookingForm.get('attendees') as FormArray;

      for (let i = 1; i < seats; i++) {
        this.attendees.push(
          this.fb.group({ attendee_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]] })
        );
      }
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log("form fields are", this.bookingForm.value);
      this.selectedEvent.no_seats_available = this.selectedEvent.no_seats_available - this.bookingForm.value.no_of_seats;
      this.ticketsBookedFlag = true;
    }
  }

}
