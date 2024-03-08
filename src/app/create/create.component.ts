import { Component, inject } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Firestore, collection, collectionData, addDoc, setDoc, doc } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, Storage, uploadBytes } from '@angular/fire/storage';


import { Quill } from 'quill';


import { Observable, } from 'rxjs';
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


    // Variable to store rich text content
    richTextContent: string = '';
  // You can customize Quill options if needed


    // Optional: Access Quill instance
    quill: Quill | undefined;
    formGroup: any;


    onRichTextChange(content: string): void {
      this.richTextContent = content;
    }






      // Initialize properties for specific media types
  newCard: Card = {
    product_name_card: '',
    product_name: '',
    product_description_editor: '',
    product_detail_editor: '',
    product_info_editor: '',
    product_scenarios_editor: '',
    product_media_base: [{ product_type: '', product_media_url: '', media_alt: '' }],
    product_media_one: [{ product_type: '', product_media_url: '', media_alt: '' }],
    product_media_two: [{ product_type: '', product_media_url: '', media_alt: '' }],
    product_media_three: [{ product_type: '', product_media_url: '', media_alt: '' }],
    product_media_four: [{ product_type: '', product_media_url: '', media_alt: '' }],
    product_media_fluid_banner: [{ product_type: '', product_media_url: '', media_alt: '' }],
  };


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
  imagePath(event: any, name: string): void {
    const fileInput = event.target;
    const files = fileInput.files;

    // if (files && files.length > 0) {
    //   this.fileInputs[index].file = files[0];
    // }
  }



  // Function to generate a unique path in Firebase storage
  generateUniquePath(fileName: string): string {
    const timestamp = new Date().getTime();
    return `/${timestamp}_${fileName}`; // set folder path for sub or main 
  }


  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      // const newCard: Card = {
        this.newCard.product_name_card = form.value.product_name_card,
        this.newCard.product_name = form.value.product_name,
        this.newCard.product_description_editor = form.value.product_description_editor,
        this.newCard.product_detail_editor = form.value.product_detail_editor,
        this.newCard.product_info_editor = form.value.product_info_editor,
        this.newCard.product_scenarios_editor = form.value.product_scenarios_editor,


        
        this.newCard.product_media_base = [];
        this.newCard.product_media_one = [];
        this.newCard.product_media_two = [];
        this.newCard.product_media_three = [];
        this.newCard.product_media_four = [];
        this.newCard.product_media_fluid_banner = [];


      // };
  
      // Set rich text content in newCard
      // newCard.rich_text_content = this.richTextContent;

      const aCollection = collection(this.firestore, 'model');



      
      try {
        // Wait for setDoc to complete and log the id
        const docRef = await addDoc(aCollection, this.newCard);
        console.log("Document successfully written with id:", docRef.id);
  

        // Check if selectedFiles is not null before accessing its properties
        // if (this.fileInputs.length > 0) {
        //   const basePath = '/'; // Adjust this according to your folder structure
        //   const downloadURLs = await this.uploadMedia(this.fileInputs.map(input => input.file), basePath);
        
        //   // Loop through fileInputs and update newCard with media URLs and types
        //   for (let i = 0; i < this.fileInputs.length; i++) {
        //     const currentFileInput = this.fileInputs[i];
        //     const downloadURL = downloadURLs[i];
        
        //     // Update the newCard object with the media URL and type
        //     newCard.card_media.push({ card_type: currentFileInput.card_type, card_media_url: downloadURL });
        //   }
        // } else {
        //   console.error('File inputs array is empty');
        // }

      // Update the Firestore document with the media URLs
      await setDoc(doc(aCollection, docRef.id), this.newCard, { merge: true });







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

      this.richTextContent = ''; // Reset rich text content after submission


    }
  }
  




}
