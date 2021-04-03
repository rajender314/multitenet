import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DummyControls {
  static controlsData = {
    PAGE_TEMPLATES: [
      {
        name: 'primary_color',
        type: 'text',
        required: true,
        label: 'Primary Color',
        value: ''
      },
      {
        name: 'secondary_color',
        type: 'text',
        required: true,
        label: 'Secondary Color',
        value: ''
      },
      {
        name: 'header_color',
        type: 'select',
        required: '',
        label: 'Header Color',
        value: ''
      },
  
      {
        name: 'body_color',
        type: 'text',
        required: '',
        label: 'Body Color',
        value: ''
      },
      {
        name: 'footer_color',
        type: 'text',
        required: '',
        label: 'Footer Color',
        value: ''
      },
    ]
  };
}
