// types.ts
export interface Genders {
    id: string;
    name: string;
    image: { url: string };
    books: {
      id: string;
      title: string;
      image: { url: string };
      author: { name: string };
      price: number;
      gender: { id: string, name: string };
    }[];
  }
  
  export interface Review {
    id: string;
    rating: number;
    book: { id: string };
  }
  