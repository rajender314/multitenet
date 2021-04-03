import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
     imports: [ FileUploadModule],  
     declarations: [ ],
     exports :[ FileSelectDirective, FileDropDirective, FormsModule,
               FileUploadModule],
})
export class SharedModule { }