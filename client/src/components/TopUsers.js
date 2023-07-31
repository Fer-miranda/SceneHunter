
// import React, { useEffect, useState } from "react";
// import { getLocations } from "../services/location.services";

// const TopUsers = () => {
//   const [topUsers, setTopUsers] = useState([]);

//   useEffect(() => {
//     const fetchTopUsers = async () => {
//       try {
//         const response = await getLocations();
//         const locations = response.data;

//         const userCounts = locations.reduce((counts, location) => {
//           const userId = location.userOwner;
//           counts[userId] = (counts[userId] || 0) + 1;
//           return counts;
//         }, {});

//         const sortedUsers = Object.entries(userCounts)
//           .sort((a, b) => b[1] - a[1])
//           .map(([userId, count ]) => ({
//             userId,
//             count, 
//           }));

//         setTopUsers(sortedUsers);
//         console.log(response.data)
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchTopUsers();
//   }, []);

//   return (
//     <div>
//       <h1>Top Users</h1>
//       <ul>
//         {topUsers.map((user) => (
//           <li key={user.userId}>
//             User ID: {user.userId}, Locations Created: {user.count}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TopUsers;

// import React, { useEffect, useState } from "react";
// import { getLocations } from "../services/location.services";

// const TopUsers = () => {
//   const [topUsers, setTopUsers] = useState([]);

//   useEffect(() => {
//     const fetchTopUsers = async () => {
//       try {
//         const response = await getLocations();
//         const locations = response.data;

//         const userCounts = locations.reduce((counts, location) => {
//           const userId = location.userOwner;
//           counts[userId] = (counts[userId] || 0) + 1;
//           return counts;
//         }, {});

//         const userNames = {};
//         locations.forEach((location) => {
//           userNames[location.userOwner] = location.userName;
//         });

//         const sortedUsers = Object.entries(userCounts)
//           .sort((a, b) => b[1] - a[1])
//           .map(([userId, count]) => ({
//             userId,
//             userName: userNames[userId],
//             count,
//           }));

//         setTopUsers(sortedUsers);
//         console.log(response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchTopUsers();
//   }, []);
  

//   return (
//     <div>
//       <h1>Top Users</h1>
//       <ul>
//         {topUsers.map((user) => (
//           <li key={user.userId}>
//             {user.userName} {user.count}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TopUsers;
import React, { useEffect, useState } from "react";
import { getLocations } from "../services/location.services";
import CancelIcon from '@mui/icons-material/Cancel';
import "./TopUsers.css";

const TopUsers = ({setShowTopUsers}) => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await getLocations();
        const locations = response.data;

        const userCounts = locations.reduce((counts, location) => {
          const userId = location.userOwner;
          counts[userId] = (counts[userId] || 0) + 1;
          return counts;
        }, {});

        const userNames = {};
        const locationNames = {};
        locations.forEach((location) => {
          const userId = location.userOwner;
          userNames[userId] = location.userName;
          if (!locationNames[userId]) {
            locationNames[userId] = [];
          }
          locationNames[userId].push(location.name);
        });

        const sortedUsers = Object.entries(userCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([userId, count]) => ({
            userId,
            userName: userNames[userId],
            count,
            locationNames: locationNames[userId] || [],
          })).slice(0, 3);

        setTopUsers(sortedUsers);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="topuserscontainer">
      <h2>Top Hunters</h2>
      
        {topUsers.map((user) => (
          <div key={user.userId} className="topusercontainer1">
            <h3 className="username">{user.userName} 🎬</h3>
            <h3 className="usercount">has hunted {user.count} scenes</h3>
            <div>
              {user.locationNames?.map((locationName) => (
                <p key={locationName} className="namelocation"> {locationName}</p>
              ))}
            </div>
          </div>
        ))}
      
      <CancelIcon className="cancel-icon" onClick={() => setShowTopUsers(false)} fontSize="small"/>
    </div>
  );
};

export default TopUsers;
