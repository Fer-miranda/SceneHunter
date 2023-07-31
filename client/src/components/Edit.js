// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Form } from "./Form";
// import { getLocationById } from "../services/location.services";

// const EditionView = (lat, lon) => {
//   const { id } = useParams();
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const response = await getLocationById(id);
//         setLocation(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (id) {
//       fetchLocation();
//     }
//   }, [id]);

//   return (
//     <div>
//       <Form location={location} locationId={id} lat={lat} lon={lon} />
//     </div>
//   );
// };

// export default EditionView;



// import React from "react";
// import {Form} from "./Form";

// const Edit = () => {
//   return (
//     <div>
//       <Form />
//     </div>
//   )
// };

// export default Edit;

import { Form } from "./Form";
import { getLocationById } from "../services/location.services";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { locationId } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await getLocationById(locationId);
        setLocation(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
  }, [locationId]);

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form location={location} locationId={locationId}/>
    </div>
  );
};

export default Edit;