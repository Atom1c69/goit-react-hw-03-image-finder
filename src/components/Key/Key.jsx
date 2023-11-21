import axios from 'axios';

export const BASE_KEY = '40007152-0c7130617416034a5b1b2a37a';

export const DataImages = async (value, page) => {
  const response = await axios.get(
    `https://pixabay.com/api/?q=${value}&page=${page}&key=${BASE_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );

  return response;
};