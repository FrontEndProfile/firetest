import { Component, inject } from '@angular/core';

import { Firestore ,collection , collectionData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  firestore : Firestore = inject(Firestore);
  items$: Observable<any[]>


  title= "FIREBASE GET COLLECTIONS";

  constructor(){
    const aCollection = collection(this.firestore, 'model')
    this.items$ = collectionData(aCollection)
    
    // Subscribe to the observable and log the data when it arrives
    // this.items$.subscribe(data => {
    //   console.log("FROM FIREBASE DATA:", JSON.stringify(data, null, 2));
    // });

  }
   
}
