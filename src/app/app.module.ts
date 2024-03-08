import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';






@NgModule({
  declarations: [
    AppComponent,
    CreateComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"cms-products-287d7","appId":"1:865928551591:web:5fa7d3770ce9f5dc2a4f82","storageBucket":"cms-products-287d7.appspot.com","apiKey":"AIzaSyBmo1ZZknD-3l38jY9IywLBbCJv3F5IvTI","authDomain":"cms-products-287d7.firebaseapp.com","messagingSenderId":"865928551591"})),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    FormsModule,
    QuillModule.forRoot(),


  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
