
// card.model.ts
// export interface Card {
//     card_tittle: string;
//     card_info: string;
//     card_decs: string;
//     card_media: { card_type: string; card_media_url: string }[]; // Array of objects
    
//     rich_text_content?: string;


// }
  




export interface Card {

product_name_card : string;
product_name : string;
product_description_editor : string;
product_detail_editor : string;
product_info_editor : string;
product_scenarios_editor : string;


product_media_base : { product_type: string; product_media_url: string ; media_alt:string }[];

product_media_one : { product_type: string; product_media_url: string ; media_alt:string }[];
product_media_two : { product_type: string; product_media_url: string ; media_alt:string }[];
product_media_three : { product_type: string; product_media_url: string ; media_alt:string }[];
product_media_four : { product_type: string; product_media_url: string ; media_alt:string }[];

product_media_fluid_banner : { product_type: string; product_media_url: string ; media_alt:string }[];


}