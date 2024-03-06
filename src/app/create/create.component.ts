import { Component , inject} from '@angular/core';

import { NgForm } from '@angular/forms';

import { Firestore ,collection , collectionData , addDoc } from '@angular/fire/firestore';




import { Observable , from } from 'rxjs';
import { Card } from '../card.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {


  firestore : Firestore = inject(Firestore);
  items$: Observable<any[]>


  constructor(){
    // GET DATA 
    const aCollection = collection(this.firestore, 'model')
    this.items$ = collectionData(aCollection)
  }


  cards: Observable<any>;

  async onSubmit(form: NgForm):Promise<void> {
    if (form.valid) {
      const newCard: Card = {
        card_tittle: form.value.card_tittle,
        card_info: form.value.card_info,
        card_decs: form.value.card_decs
      };

      const aCollection = collection(this.firestore, 'model')
      try {
        // Wait for setDoc to complete and log the id
        const docRef = await addDoc(aCollection, newCard);
        console.log("Document successfully written with id:", docRef.id);
        // Log the newly created card data
        console.log("New Card Data:", newCard);
        
      } catch (error) {
        console.error("Error writing document: ", error);
      }

      // Optionally, you can reset the form after submission
      form.reset();
    }
  }




}
