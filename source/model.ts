export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';

type ImageURL = string;

export interface Movie {
  Title: string;
  imdbID: string;
  Poster: ImageURL;
  Year: string;
}
