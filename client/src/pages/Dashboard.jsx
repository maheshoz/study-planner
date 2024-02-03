import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userGroupsData, setUserGroupsData] = useState(null);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log("redux data", currentUser.data);

  useEffect(() => {
    console.log("data ");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // fetch("localhost:8080/api/user", requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log("error", error));

    const fetchUser = async () => {
      const res = await fetch("http://192.168.1.130:8080/api/user", {
        method: "GET",
        headers: myHeaders,
        // body: JSON.stringify(formData),
      });
      const data = await res.json();
      setUserData(data);
      console.log("get user data, ", data);

      fetchUserGroups();
    };
    fetchUser();

    const fetchUserGroups = async () => {
      const res = await fetch("http://192.168.1.130:8080/api/user/groups", {
        method: "GET",
        headers: myHeaders,
        // body: JSON.stringify(formData),
      });
      const response = await res.json();
      setUserGroupsData(response["data"]);
      console.log("get user groups data, ", userGroupsData);
    };
    fetchUserGroups();
  }, []);

  console.log("usergroup data", userGroupsData);

  function GroupItem({ name, description }) {
    return (
      <Link className='p-6 inline-block m-2 bg-white shadow-md hover:shadow-lg rounded-lg w-64'>
        <p className='text-2xl font-semibold text-slate-600'> {name}</p>
        <p className='text-l text-slate-600'>Description : {description}</p>
      </Link>
    );
  }

  return (
    <div className=' px-3 max-w-6xl mx-auto'>
      {/* <h1 className='text-center text-slate-700 text-2xl pt-6'>
        Welcome to Dashboard page
      </h1> */}

      <div className='w-full'>
        <h2 className="text-3xl font-semibold text-slate-600 mt-6">Your Groups: </h2>

        {userGroupsData && userGroupsData.length === 0 && (
          <p>No groups found, create new one</p>
        )}

        <div className='max-w-6xl mx-auto p-3 flex flex-row flex-wrap gap-4 my-4'>
          {userGroupsData &&
            userGroupsData.length > 0 &&
            userGroupsData.map((group) => (
              <GroupItem
                key={group.name}
                name={group.name}
                description={group.description}
              />
            ))}
        </div>

        <Link
          to={"/create-group"}
          className='bg-green-700 text-white p-3 inline-block rounded-lg uppercase text-center hover:opacity-90'
        >
          Create Group{" "}
        </Link>
      </div>

      <div className=''>
        <h3 className=' text-slate-700 text-2xl pt-6'>Pending group tasks:</h3>
      </div>
    </div>
  );
}
