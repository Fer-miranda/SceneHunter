import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Map, Marker, NavigationControl, Popup, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getLocations, deleteLocation, saveLocation, getSavedLocationIds, getSavedLocations, getLocationLikes, likeLocation, getUserLikedLocations } from "../services/location.services";
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import { format } from 'timeago.js';
import { Register } from "./Register";
import { Login } from "./Login";
import { Form } from './Form'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import { Flip, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useGetUserID, useGetUserName } from "../hooks/useGetUserId";
import { useCookies } from "react-cookie";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Map.css';
import TopLocations from "./TopLocations";
import TopUsers from "./TopUsers";
import Geocoder from "./Geocoder/Geocoder";

const userNotLoggedIn = () => {
  toast.warning("Register to hunt scenes! 👻");
}

const Mapa = () => {
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState();
  const userID = useGetUserID();
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showTopUsers, setShowTopUsers] = useState(false);
  const [viewPort, setViewPort] = useState({
    longitude: 12.4,
    latitude: 37.8,
    zoom: 14
  });
  const [locationId, setLocationId] = useState(null);
  const userName = useGetUserName();
  const [savedLocationIds, setSavedLocationIds] = useState([]);
  const [likes, setLikes] = useState({});
  const [likedLocations, setLikedLocations] = useState([]);


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        setLocations(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLocations();
  }, [userID]);

  useEffect(() => {
    const fetchLocationLikes = async () => {
      try {
        const likesData = {};
        for (const location of locations) {
          const response = await getLocationLikes(location._id);
          likesData[location._id] = response.data.likes;
        }
        setLikes(likesData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLocationLikes();
  }, [locations]);

  useEffect(() => {
    const fetchSavedLocationIds = async () => {
      try {
        if (userID) {
          const response = await getSavedLocationIds(userID);
          setSavedLocationIds(response.data.savedLocations);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchSavedLocationIds();
  }, [userID]);

  const fetchLikedLocationsIds = async () => {
    try {
      if (userID) {
        const response = await getUserLikedLocations(userID);
        const likedLocationIds = response.data.likedLocations.map((location) => location._id);
        setLikedLocations(likedLocationIds);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchLikedLocationsIds();
  }, [userID]);

  const removeLocation = async (locationId) => {
    try {
      const locationToDelete = locations.find((location) => location._id === locationId);

      if (locationToDelete.userOwner === userID) {
        await deleteLocation(locationId, cookies.access_token);
        const response = await getLocations();
        toast.info("Scene deleted ✅.");
        setLocations(response.data);
      } else {
        console.log("No tienes permisos para eliminar este location.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    toast(`Come back soon ${userName}! 🎬`);
  };

  const saveLocationHandler = async (locationID) => {
    try {
      await saveLocation(userID, locationID);
      const response = await getSavedLocationIds(userID);
      setSavedLocationIds(response.data.savedLocations);
      toast.info("Scene added to your favorites! ✅");
    } catch (err) {
      console.log(err);
    }
  };

  const isLocationSaved = (id) => savedLocationIds.includes(id);

  const handleClick = (e) => {
    try {
      let lat = e.lngLat.lat;
      let lon = e.lngLat.lng;
      setNewLocation({
        lat: lat,
        lng: lon
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocClick = (id, lat, lon) => {
    if (userID === null) {
      userNotLoggedIn();
      return;
    } else {
      setLocationId(id);
    }
  };

  const handleLike = async (locationId) => {
    try {
      await likeLocation(locationId, userID, cookies.access_token);
      const response = await getLocationLikes(locationId);
      const updatedLikes = { ...likes };
      updatedLikes[locationId] = response.data.likes;
      setLikes(updatedLikes);
      setLikedLocations((prevLikedLocations) => [...prevLikedLocations, locationId]);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      <div className="header">
        <div className="header_1">
          {userID ? (
            <div>
            <button className="button-top" onClick={() => setShowTop(true)}>Top Scenes 📸</button>
            <button className="button-logout" onClick={handleLogout}>Logout</button>
            <button className="button-top" onClick={() => setShowTopUsers(true)}>Top Hunters 🎬</button>
            </div>
          ) : (
            <div>
              <button className="button-login" onClick={() => setShowLogin(true)}>Login</button>
              <button className="button-register" onClick={() => setShowRegister(true)}>Register</button>
            </div>
          )}
        </div>
      </div>
      <Map
        container={'map'}
        projection={'globe'}
        initialViewState={{ viewPort }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/fjmir/clio0qlw701ct01qgge9d9jno"
        style={{ width: "100vw", height: "100vh" }}
        onDblClick={handleClick}
      >
        <ToastContainer
          position="bottom-left"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Flip}
        />
        <Geocoder position="bottom-right" />
        <GeolocateControl position="top-right" />
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {locations.map((loc) => (
          <>
            <Marker
              key={loc._id}
              longitude={loc.lon}
              latitude={loc.lat}
              anchor="center"
            >
              {isLocationSaved(loc._id) && userID ? (
                <StarIcon
                  className="location"
                  onClick={() => handleLocClick(loc._id, loc.lat, loc.lon)}
                  style={{
                    fontSize: viewPort.zoom * 2.5,
                    color: "yellow"
                  }}
                />
              ) : (
                <PlaceTwoToneIcon
                  className="location"
                  onClick={() => handleLocClick(loc._id, loc.lat, loc.lon)}
                  style={{
                    fontSize: viewPort.zoom * 2.5,
                    color: loc.userOwner === userID ? "tomato" : "teal"
                  }}
                />
              )}
            </Marker>

            {loc._id === locationId && (
              <Popup
                longitude={loc.lon}
                latitude={loc.lat}
                closeOnClick={false}
                closeOnMove={false}
                anchor="left"
              >
                <div className="info">
                  <p className="userName">Created by: <b>{loc.userName}</b> {format(loc.createdAt)}</p>
                  <h4 className="likes">❤️️ {likes[loc._id]}</h4>
                  {/* <p className="likes">ID: {[loc._id]}</p> */}
                </div>
                <div className="card-location">
                  <label>Category</label>
                  <h3 className="category">{loc.category}</h3>
                  <label>Title</label>
                  <h3 className="name">{loc.name}</h3>
                  <label>Description</label>
                  <h3 className="description">{loc.description}</h3>
                  {loc.images.length > 0 && (
                    <Carousel showArrows={true} showThumbs={false}>
                      {loc.images.map((image, index) => (
                        <div key={index} className="img-container">
                          <img
                            src={`http://localhost:3001/img/${image}`}
                            alt={loc.name}
                            style={{ width: "320px", height: "250px" }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  )}
                </div>
                <div className="buttons-contenedor">
                {loc.userOwner !== userID && (
                  <Button
                    className="favoritos"
                    onClick={() => saveLocationHandler(loc._id)}
                    disabled={isLocationSaved(loc._id)}
                  >
                    {isLocationSaved(loc._id) ? (
                      <>
                        <StarIcon style={{ color: 'gold' }} fontSize="small" /> {<p className="wishlist"> ADDED</p>}
                      </>
                    ) : (
                      <>
                        <StarIcon style={{ color: 'whitesmoke'}} fontSize="small" /> {<p className="wishlist"> Wish List</p>}
                      </>
                    )}
                  </Button>
                )}
                {loc.userOwner !== userID && (
                  <IconButton className="favoritos">
                    <FavoriteIcon
                      style={{
                        color: likedLocations.includes(loc._id) ? 'orangered' : 'whitesmoke'
                      }}
                      fontSize="small"
                      className="like-button"
                      onClick={() => handleLike(loc._id)}
                      disabled={likedLocations.includes(loc._id)}
                    />
                    <p className="wishlist">
                    {likedLocations.includes(loc._id) ? "LIKED" : "LIKE"}
                    </p>
                  </IconButton>
                )}
                {loc.userOwner === userID && (
                  <div className="delete-edit">
                    <IconButton>
                      <DeleteIcon onClick={() => removeLocation(loc._id)} className="Icon" fontSize="small"/> {<p className="wishlist1">DELETE</p>}
                    </IconButton>
                    <IconButton  component={Link} to={`/home/${locationId}`} >
                      <EditLocationAltIcon className="Icon" fontSize="small"/> {<p className="wishlist1" >EDIT</p>}
                    </IconButton>
                    {/* <Button variant="outlined" className="button-icon" startIcon={<EditLocationAltIcon className="Icon" />}>
                      <Link to={`/home/${locationId}`} className="link">Edit</Link>
                    </Button> */}
                  </div>
                )}
                </div>
              </Popup>
            )}
          </>
        ))}

        {newLocation && (
          <Popup
            longitude={newLocation.lng}
            latitude={newLocation.lat}
            closeOnClick={false}
            closeOnMove={false}
            onClose={() => setNewLocation(null)}
            anchor="left"
          >
            <Form
              lat={newLocation.lat}
              lon={newLocation.lng}
              fetchLocations={setLocations}
            />
          </Popup>
        )}

        <div className="título">
          <h1>Scene</h1>
          <h1>Hunter</h1>
          {/* {userID ? (
          <button className="button-top" onClick={() => setShowTop(true)}>Top Scenes</button>
          ) : ""} */}
        </div>
      </Map>

      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin} />}
      {showTop && <TopLocations setShowTop={setShowTop} />}
      {showTopUsers && <TopUsers setShowTopUsers={setShowTopUsers} />}
    </div>
  );
}

export default Mapa;


