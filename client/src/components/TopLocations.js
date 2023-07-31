import React, { useState, useEffect } from "react";
import { getLocations, getLocationLikes } from "../services/location.services";
import CancelIcon from '@mui/icons-material/Cancel';
import "./TopLocations.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Carousel } from 'react-responsive-carousel';
import { format } from 'timeago.js';

const TopLocations = ({setShowTop}) => {
  const [topLocations, setTopLocations] = useState([]);

  useEffect(() => {
    const fetchTopLocations = async () => {
      try {
        const response = await getLocations();
        const locations = response.data;

        // Ordenar las ubicaciones según la cantidad de likes
        locations.sort((a, b) => {
          const likesA = a.likes || 0;
          const likesB = b.likes || 0;
          return likesB - likesA;
        });

        // Obtener las primeras ubicaciones
        const top3Locations = locations.slice(0, 3);

        // Obtener la cantidad de likes para cada ubicación
        const likesData = {};
        for (const location of top3Locations) {
          const response = await getLocationLikes(location._id);
          likesData[location._id] = response.data.likes;
        }

        setTopLocations(top3Locations);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTopLocations();
  }, []);

  return (
    <div className="top-container">
      <h2 className="top">Top Scenes 📸</h2>  
      <Carousel autoPlay={true} interval={7000} infiniteLoop={true} showIndicators={false}  showStatus={false}>
      {topLocations.map((location) => (
          <div key={location._id} >
            <div className="datos">
              <h4><FavoriteIcon style={{color: 'tomato'}} fontSize="small" />{location.likes}</h4>
              <p>Created by: <b>{location.userName}</b> {format(location.createdAt)}</p>
            </div >
            <div className="top-container1">
            <h4 className="h4">Category</h4>
            <h3 className="h3">{location.category}</h3>
            <h4 className="h4">Title</h4>
            <h3 className="h3">{location.name}</h3>
            <h4 className="h4">Description</h4>
            <h3 className="h3">{location.description}</h3>
            </div>
            <Carousel showThumbs={false} showArrows={false}  showStatus={false} >
            {location.images.map((image, index) => (
              <div key={index}>
              <img
                src={`http://localhost:3001/img/${image}`}
                alt={location.name}
                style={{ width: "180px", height: "180px" }}
              />
            </div>
          ))}
          </Carousel>          
          </div>
        ))}
          </Carousel>
      <CancelIcon className="cancel-icon" onClick={() => setShowTop(false)} fontSize="small"/>
    </div>
  );
};

export default TopLocations;
