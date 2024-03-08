import { Component, inject } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Firestore, collection, collectionData, addDoc, setDoc, doc } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, Storage, uploadBytes } from '@angular/fire/storage';





import { Observable, from } from 'rxjs';
import { Card } from '../card.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  // Inject Firestore and Storage
  firestore: Firestore = inject(Firestore);
  storage = inject(Storage);

  // Set the storage folder
  storageFolder = '/product';

  // Create a root reference
  storageRef = ref(this.storage, this.storageFolder);

  // Observable for Firestore data
  items$: Observable<any[]>;

  selectedFiles: File[] = [];

  fileInputs: { file: File | null, card_type: string }[] = [];



  constructor() {
    // GET DATA 
    const aCollection = collection(this.firestore, 'model')
    this.items$ = collectionData(aCollection)
  }

  // async uploadMedia(blob: Blob, filePath: string): Promise<string> {
  //   const fileRef = ref(this.storageRef, filePath);
  
  //   try {
  //     const uploadTask = await uploadBytes(fileRef, blob);
  //     const downloadURL = await getDownloadURL(uploadTask.ref);
  //     console.log("File uploaded successfully. URL:", downloadURL);
  //     return downloadURL;
  //   } catch (error) {
  //     console.error("Error uploading file:", error.message);
  //     throw error; // Rethrow the error to handle it in the calling function
  //   }
  // }


  async uploadMedia(files: File[], basePath: string): Promise<string[]> {
    const downloadURLs: string[] = [];
  
    for (const file of files) {
      const filePath = this.generateUniquePath(file.name);
      const fileRef = ref(this.storageRef, `${basePath}/${filePath}`);
  
      try {
        const uploadTask = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        console.log(`File ${file.name} uploaded successfully. URL: ${downloadURL}`);
        downloadURLs.push(downloadURL);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error.message);
        throw error; // Rethrow the error to handle it in the calling function
      }
    }
  
    return downloadURLs;
  }
  
  

  addFileInput(): void {
    this.fileInputs.push({ file: null, card_type: '' });
  }


  // Function to handle local file path
  // imagePath(event: any): void {
  //   this.selectedFiles = event.target.files[0];
  // }
  imagePath(event: any, index: number): void {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files && files.length > 0) {
      this.fileInputs[index].file = files[0];
    }
  }



  // Function to generate a unique path in Firebase storage
  generateUniquePath(fileName: string): string {
    const timestamp = new Date().getTime();
    return `/${timestamp}_${fileName}`; // set folder path for sub or main 
  }


  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      const newCard: Card = {
        card_tittle: form.value.card_tittle,
        card_info: form.value.card_info,
        card_decs: form.value.card_decs,
        card_media: [], // Initialize as an empty array

      };
  
      const aCollection = collection(this.firestore, 'model');
      
      try {
        // Wait for setDoc to complete and log the id
        const docRef = await addDoc(aCollection, newCard);
        console.log("Document successfully written with id:", docRef.id);
  

        // Check if selectedFiles is not null before accessing its properties
        if (this.fileInputs.length > 0) {
          const basePath = '/'; // Adjust this according to your folder structure
          const downloadURLs = await this.uploadMedia(this.fileInputs.map(input => input.file), basePath);
        
          // Loop through fileInputs and update newCard with media URLs and types
          for (let i = 0; i < this.fileInputs.length; i++) {
            const currentFileInput = this.fileInputs[i];
            const downloadURL = downloadURLs[i];
        
            // Update the newCard object with the media URL and type
            newCard.card_media.push({ card_type: currentFileInput.card_type, card_media_url: downloadURL });
          }
        } else {
          console.error('File inputs array is empty');
        }

      // Update the Firestore document with the media URLs
      await setDoc(doc(aCollection, docRef.id), newCard, { merge: true });







        // Check if selectedFile is not null before accessing its properties
        // if (this.selectedFile) {
        //   const filePath = this.generateUniquePath(this.selectedFile.name);
        //   const downloadURL = await this.uploadMedia(this.selectedFile, filePath);

        //   // Update the newCard object with the media URL
        //   newCard.card_media = downloadURL;

        //   // Update the Firestore document with the media URL
        //   await setDoc(doc(aCollection, docRef.id), newCard, { merge: true });

        //   // Log the newly created card data with media URL
        //   console.log("New Card Data:", newCard);
        // } else {
        //   console.error("Selected file is null");
        // }
  
      } catch (error) {
        console.error("Error writing document: ", error);
      }
  
      // Optionally, you can reset the form after submission
      form.reset();

    }
  }
  




}
