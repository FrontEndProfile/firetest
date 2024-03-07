
// card.model.ts
export interface Card {
    card_tittle: string;
    card_info: string;
    card_decs: string;
    card_media: { card_type: string; card_media_url: string }[]; // Array of objects


  }
  