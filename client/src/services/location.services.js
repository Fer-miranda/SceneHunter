import axios from "axios";

const URL = "http://localhost:3001/api/locations";

export const getLocations = () => axios.get(`${URL}/`);

export const getLocationById = (locationId) => axios.get(`${URL}/${locationId}`);

export const saveLocation = (userId, locationID) => axios.put(`${URL}/`, { userID: userId, locationID: locationID });

export const getSavedLocationIds = (userId) => axios.get(`${URL}/savedLocations/ids/${userId}`);

export const getSavedLocations = (userId) => axios.get(`${URL}/savedLocations/${userId}`);


export const createLocation = async (locationData, accessToken) => {
    try {
      const formData = new FormData();
      formData.append('name', locationData.name);
      formData.append('category', locationData.category);
      formData.append('description', locationData.description);
      formData.append('lat', locationData.lat);
      formData.append('lon', locationData.lon);
      formData.append('userOwner', locationData.userOwner);
      formData.append('userName', locationData.userName);
      formData.append('likes', locationData.likes);
      if (locationData.images && typeof locationData.images[Symbol.iterator] === 'function') {
        Array.from(locationData.images).forEach((image) => {
          formData.append('images', image);
        });
      }
      // Array.from(locationData.images).forEach((image) => {
      //   formData.append('images', image);
      // });
  
      const response = await axios.post(`${URL}/`, formData, {
        headers: {
          authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      console.log(error)
      // throw error.response ? error.response.data : error.message;
    }
  };
  
  export const updateLocation = async (locationId, locationData, accessToken) => {
    try {
      const formData = new FormData();
      formData.append('name', locationData.name);
      formData.append('category', locationData.category);
      formData.append('description', locationData.description);
      formData.append('userOwner', locationData.userOwner);
      formData.append('lat', locationData.lat);
      formData.append('lon', locationData.lon);
      formData.append('likes', locationData.likes);
      if (locationData.images && typeof locationData.images[Symbol.iterator] === 'function') {
        Array.from(locationData.images).forEach((image) => {
          formData.append('images', image);
        });
      };
      // Array.from(locationData.images).forEach((image) => {
      //   formData.append('images', image);
      // });

  
      const response = await axios.put(`${URL}/${locationId}`, formData, {
        headers: {
          authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };
  
  export const deleteLocation = (locationId, accessToken) =>
  axios.delete(`${URL}/${locationId}`, {
    headers: {
      authorization: accessToken,
    },
  });

  export const getUserLocations = (userId) => axios.get(`${URL}/userLocations/${userId}`);

  export const likeLocation = (locationId, userId, accessToken) =>
  axios.post(`${URL}/${locationId}/like/${userId}`, {}, {
    headers: {
      authorization: accessToken,
    },
  });

  export const getLocationLikes = (locationId) => axios.get(`${URL}/${locationId}/likes`);

  export const getUserLikedLocations = (userId) => axios.get(`${URL}/likedLocations/${userId}`);