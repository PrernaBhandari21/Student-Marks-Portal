import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  private name: string | null = null;

  setName(name: string) {
    this.name = name;
  }

  getName(): string | null {
    return this.name;
  }
}