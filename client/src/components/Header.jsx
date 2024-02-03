import {FaSearch} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";



export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  console.log('from header currentUser - ', currentUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

  }, [location.search]);


  useEffect(() => {

    if( currentUser !== null){
      console.log('data ', currentUser.data.accessToken);
      
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${currentUser.data.accessToken}`
        );
        
      
      const fetchUser = async ()=> {
        const res = await fetch('http://192.168.1.130:8080/api/user', {
          method: 'GET',
          headers:myHeaders ,
          // body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log('data get user', data);
        setUserData(data)
        console.log('get user data, ', data);
  
      }
      fetchUser();
    } else {
      console.log('currentUser null')
    }

  }, []);

  console.log(userData);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between p-6 items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>GroupStudy</span>
            <span className='text-slate-700'>Planner</span>
          </h1>
        </Link>


        <ul className="flex gap-4">
          <Link to='/dashboard'>
            {
              currentUser ? (
                <li className="text-slate-700 hover:underline">Dashboard</li>
              ) : null
            }
          </Link>
          <Link to='/'>
            <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to='/about'>
            <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
          </Link>
          <Link to='/profile'>
            {currentUser && userData !== null && userData.data ? (
              // <img className="rounded-full h-7 w-7 object-cover" src={userData.data.profilePic} alt="profile" />
              <img className="rounded-full h-7 w-7 object-cover"  alt="profile" />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>

      </div>
    </header>
  )
}