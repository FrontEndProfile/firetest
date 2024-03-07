import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';


import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  firestore: Firestore = inject(Firestore);
  storage = inject(Storage);


  items$: Observable<any[]>;

  selectedCard: any = {}; // To store the selected card for update

  selectedFile: File | null = null; // Store the selected file


  constructor(private cdr: ChangeDetectorRef) {
    const aCollection = collection(this.firestore, 'model');
    // this.items$ = collectionData(aCollection);
    this.items$ = collectionData(aCollection, { idField: 'id' });


  }

  openUpdateModal(card: any): void {
    console.log('Update button clicked. Card:', card);
    this.selectedCard = { ...card };

    // Ensure card_media is initialized as an empty array
    this.selectedCard.card_media = this.selectedCard.card_media || [];

    console.log('Selected Card:', this.selectedCard);
    document.querySelector('.modal').classList.add('show');
  }


  onFileChange(event: any, index: number): void {
    const fileInput = event.target;
    const files = fileInput.files;
  
    if (files && files.length > 0) {
      const selectedFile = files[0];
  
      // Update the card_media object at the specified index
      this.selectedCard.card_media[index].card_media_url = selectedFile;
    }
  }
  
  


  // ========== ?
  async uploadMedia(blob: Blob, filePath: string): Promise<string> {
    const fileRef = ref(this.storage, filePath);

    try {
      const uploadTask = await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log("File uploaded successfully. URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw error;
    }
    
  }

  imagePath(event: any): void {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  
  
  

  async updateCard(): Promise<void> {
    if (this.selectedCard.id) {
      // Use the selectedCard.id to update the specific document in Firestore
      const aCollection = collection(this.firestore, 'model');
      const docRef = doc(aCollection, this.selectedCard.id);
  
      try {

        if (this.selectedFile) {
          const filePath = this.generateUniquePath(this.selectedFile.name);
          const downloadURL = await this.uploadMedia(this.selectedFile, filePath);
        
          // Append a new object to the card_media array
          this.selectedCard.card_media.push({
            card_type: 'image',
            card_media_url: downloadURL,
          });
        }
        



        await setDoc(docRef, this.selectedCard);
        this.closeModal(); // Close the modal after updating
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      console.error('Selected card id is empty or undefined.');
    }
  }

  generateUniquePath(fileName: string): string {
    const timestamp = new Date().getTime();
    return `/product/${timestamp}_${fileName}`; // set folder path for sub or main 
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
    this.selectedFile = null; // Reset the selected file
    // Add any additional logic to close the modal if needed
  }
}
