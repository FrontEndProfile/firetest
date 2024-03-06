import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;

  selectedCard: any = {}; // To store the selected card for update

  constructor(private cdr: ChangeDetectorRef) {
    const aCollection = collection(this.firestore, 'model');
    // this.items$ = collectionData(aCollection);
    this.items$ = collectionData(aCollection, { idField: 'id' });

  }

  openUpdateModal(card: any): void {
    console.log('Update button clicked. Card:', card);
    this.selectedCard = { ...card };
    console.log('Selected Card:', this.selectedCard);
    document.querySelector('.modal').classList.add('show');
  }
  
  
  

  async updateCard(): Promise<void> {
    if (this.selectedCard.id) {
      // Use the selectedCard.id to update the specific document in Firestore
      const aCollection = collection(this.firestore, 'model');
      const docRef = doc(aCollection, this.selectedCard.id);
  
      try {
        await setDoc(docRef, this.selectedCard);
        this.closeModal(); // Close the modal after updating
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      console.error('Selected card id is empty or undefined.');
    }
  }
  

  async deleteCard(cardId: string): Promise<void> {
    console.log('Delete button clicked. ID :', cardId);
  
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      // Use the cardId to delete the specific document in Firestore
      const aCollection = collection(this.firestore, 'model');
      const docRef = doc(aCollection, cardId);
  
      try {
        await deleteDoc(docRef);
        this.closeModal(); // Close the modal after deleting
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  }
  
  

  closeModal(): void {
    this.selectedCard = {}; // Reset the selected card
    // Add any additional logic to close the modal if needed
  }
}
