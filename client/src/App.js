// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import './App.css';
import { Routes, Route } from "react-router-dom";
import Mapa from './components/Map.js'
import Edit from './components/Edit.js'
import { Login } from './components/Login';
import { Register } from './components/Register';
import TopLocations from './components/TopLocations';
import TopUsers from './components/TopUsers';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/home' element={<Mapa/>} />
        <Route path='/home/:locationId' element={<Edit/>} />
        {/* <Route path="/top" element={<TopUsers/>} /> */}
        {/* <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
