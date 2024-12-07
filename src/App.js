import 'bootstrap/dist/css/bootstrap.min.css'
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import NotFound from './pages/not-found/NotFound';
import UnAuthorized from './pages/unauthorized/UnAuthorized';
import Admin from './pages/admin/Admin';
import Profile from './pages/profile/Profile.jsx';
import AuthGuard from './guards/AuthGuard';
import  Role  from './models/Role';
import Main from './pages/main/Main';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/main' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/admin' element={
            <AuthGuard roles={[Role.ADMIN]}>
              <Admin />
            </AuthGuard>}></Route>
          <Route path='/profile' element={
            <AuthGuard roles={[Role.ADMIN, Role.USER]}>
              <Profile />
            </AuthGuard>
            }></Route>
          <Route path='/404' element={<NotFound />}></Route>
          <Route path='/401' element={<UnAuthorized />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}
export default App;