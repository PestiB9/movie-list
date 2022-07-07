import {Routes} from './environment/routes';
import {RequestMethod} from './model';

async function serviceRequest(
  url: string,
  method: RequestMethod,
  options?: RequestInit,
) {
  try {
    const response = await fetch(url, {method, ...options});
    const parse = await response.json();
    return parse;
  } catch (error) {
    console.log('http error on URL', url, method, options, error);
    throw error;
  }
}

function get(url: string) {
  return serviceRequest(url, 'GET');
}

export async function searchMovies(searchData: string) {
  const response = await get(`${Routes.search}s=${searchData}`);
  return response.Search || [];
}
