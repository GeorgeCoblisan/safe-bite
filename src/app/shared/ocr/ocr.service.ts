import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  async convertImageToText(imageUrl: string): Promise<string | undefined> {
    const result = await Tesseract.recognize(imageUrl, 'ron');

    return this.extractIngredients(result.data.text);
  }

  private extractIngredients(text: string): string | undefined {
    text = text.replace(/\s+/g, ' ').trim();

    console.log(text);

    const match = text.match(/ingrediente[:\-]\s*(.*)/i);

    if (match && match[1]) {
      let ingredients = match[1];

      ingredients = ingredients
        .split(/(Alergeni:|Conține:|\.|\n|Pentru detalii|Poate conține)/i)[0]
        .trim();

      ingredients = ingredients.replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9,.\-% ]/g, '');

      ingredients = ingredients.replace(/\s*,\s*/g, ', ');

      ingredients = ingredients.replace(/\s+/g, ' ');

      return ingredients;
    }

    return undefined;
  }
}
