import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WysiwygContent } from '../model/Wysiwyg.model';

@Injectable({
  providedIn: 'root'
})
export class WysiwygService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<WysiwygContent[]>('/api/wysiwyg');
  }

  getById(id: string) {
    return this.http.get(`/api/wysiwyg/${id}`);
  }

  save(content: WysiwygContent) {
    return this.http.post(`/api/wysiwyg`, content);
  }
}
