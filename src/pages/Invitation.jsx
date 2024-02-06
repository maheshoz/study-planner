import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaCheckCircle,
  FaCheckSquare,
  FaExternalLinkAlt,
  FaRocket,
  FaShare,
  FaTasks,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import Loading from "../components/Loading";

export default function Invitation() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [emailInvite, setEmailInvite] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [tasks, setTasks] = useState(null);
  const [tasksFlag, setTasksFlag] = useState(false);
  const [chatDiscussions, setChatDiscussions] = useState("");
  const [groupMembersData, setGroupMembersData] = useState(null);
  const [tempChat, setTempChat] = useState("");
  const [chatDiscussionFlag, setChatDiscussionFlag] = useState(false);
  // console.log('currentUser', currentUser);
  console.log("params ", params);

  useEffect(() => {
    const fetchGroupListing = async () => {
      try {
        let myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${currentUser.data.accessToken}`
        );

        // let requestOptions = {
        //   method: "GET",
        //   headers: myHeaders,
        //   redirect: "follow",
        // };

        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/api/invitation/verify/${params.token}`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const data = await res.json();
        if (data.success === false) {
          console.log(data);
          console.log(" resonse message", data.message);
          setError(true);
          setLoading(false);
          return;
        }
        // setListing(data);
        console.log("Group data", data);
        setGroupData(data);
        console.log("state data", groupData);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchGroupListing();
  }, []);
  console.log("Invitation Data", groupData);

  return (
    <main className="  w-full  flex  items-center bg-slate-100 justify-center">
      <div className=" bg-white  p-16 mt-8 mb-16">
        {loading && <Loading />}
        {error && (
          <p className="text-center my-7 text-2xl">Something went wrong</p>
        )}
        {groupData && <h1 className="text-2xl">{groupData.message}</h1>}
      </div>
    </main>
  );
}
