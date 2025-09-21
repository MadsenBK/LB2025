// import lb_logo from '../imgs/logo5.png';
import lb_logo from '../../assets/imgs/logo/Logo(gold-transparent) copy.png';
import Navbar from "./headerRightMenu";

export default function Header() {

  return (
<header className="h-24 flex justify-between items-center px-64 pt-6 w-full">
  <div className="flex items-end justify-start w-full"> 
    <img src={lb_logo} alt="Logo" width="110"/>
  </div>

  <div className="flex flex-col justify-end items-center h-full w-full">
    <div className="flex fkex-row space-x-8 font-body text-xl text-white">
      <a href="/" className="hover:text-gray-400">Home</a>
      <a href="/register" className="hover:text-gray-400">Register</a>
      <a href="/login" className="hover:text-gray-400">Login</a>
    </div>
  </div>

  <div className='flex justify-end items-end h-full w-full'>
    <Navbar />
  </div>
</header>
  );
}
