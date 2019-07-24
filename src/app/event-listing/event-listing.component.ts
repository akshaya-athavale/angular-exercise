import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-listing',
  templateUrl: './event-listing.component.html',
  styleUrls: ['./event-listing.component.css']
})
export class EventListingComponent implements OnInit {

  eventList;
  filteredList;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getEventList().subscribe(data =>{
      if(data && data.events){
          this.eventList = data.events;
          this.filteredList = this.eventList;
      }
    });
  }

  searchEvents(searchText){
    if(searchText && searchText != ''){
      this.filteredList = this.eventList.filter((item,index) => {
        return item.name.toLowerCase().includes(searchText.toLowerCase())
      });
    }else{
      this.filteredList = this.eventList;
    }
  }

}
