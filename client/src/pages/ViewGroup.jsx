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

export default function ViewGroup() {
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
  const [tempChat, setTempChat] = useState('');
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
          `http://192.168.1.130:8080/api/group/${params.groupId}`,
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
        setGroupData(data["data"]);
        console.log("state data", groupData);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchGroupListing();
    getAllTasks();
    getAllChatDiscussions();
  }, [params.groupId]);

  const notify = () => {
    toast("Wow so easy !");
  };

  console.log("email invite", emailInvite);

  const sendEmailInvite = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    var raw = JSON.stringify({
      emailId: emailInvite,
    });

    console.log("email json", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "http://192.168.1.130:8080/api/invitation/754effd9-b350-416b-9d49-9cabf8c3d78b",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast(result.message);
      })
      .catch((error) => {
        console.log("error", error);
        toast(error.message);
      });
  };

  const handleTaskBtnClick = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    var raw = JSON.stringify({
      taskName: taskName,
      taskDescription: taskDescription,
      taskDeadline: taskDeadline,
    });

    console.log("task input json", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://192.168.1.130:8080/api/task/${params.groupId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast(result.message);
        setTaskName("");
        setTaskDeadline("");
        setTaskDescription("");
        getAllTasks();
      })
      .catch((error) => {
        console.log("error", error);
        toast(error.message);
      });
  };

  const handleDiscussionClick = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    var raw = JSON.stringify({
      discussion: tempChat,
    });

    console.log("chat input json", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://192.168.1.130:8080/api/group/forum/${params.groupId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast(result.message);
        setTempChat("");
        getAllChatDiscussions();
        // getAllTasks()
      })
      .catch((error) => {
        console.log("error", error);
        toast(error.message);
      });
  };

  const getAllTasks = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://192.168.1.130:8080/api/group/tasks/${params.groupId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("all tasks", result);
        setTasks(result["data"]);
        console.log("tasks ", tasks);
        setTasksFlag(true);
      })
      .catch((error) => {
        console.log("error", error);
        setTasksFlag(false);
      });
  };

  const getAllChatDiscussions = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://192.168.1.130:8080/api/group/forum/${params.groupId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("all tasks", result);
        setChatDiscussions(result["data"]);
        console.log("chat discussions ", chatDiscussions);
        setTempChat('');
        setChatDiscussionFlag(true);
      })
      .catch((error) => {
        console.log("error", error);
        setChatDiscussionFlag(false);
      });
  };

  function updateTaskDone(taskId) {
    console.log("update task id", taskId);
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(`http://192.168.1.130:8080/api/task/${taskId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("task success result", result);
        toast(result.message);
        getAllTasks();
      })
      .catch((error) => {
        console.log("error", error);
        toast(error.message);
      });
  }

  const TaskItem = (props) => {
    const { name, description, deadline, taskId, status, progress } =
      props.task;
    return (
      <div className='flex sm:mt-6 flex-col gap-4 justify-center m-2 bg-slate-100 p-3'>
        <div className='flex justify-between items-center'>
          <p className='capitalize text-xl'>{name}</p>
          <p>
            {deadline} {deadline > 1 ? "days" : "day"}
          </p>
        </div>

        <div className='flex justify-between items-center'>
          <p className='text-lg text-slate-500 flex-1'>{description}</p>

          {status && status !== "COMPLETED" ? (
            <button
              onClick={() => {
                updateTaskDone(taskId);
              }}
              className='px-3 py-2 bg-green-400 border-2 rounded-xl text-white font-bold'
            >
              {" "}
              Sync{" "}
            </button>
          ) : (
            <button>Done</button>
          )}
        </div>
        <ProgressBar className='mt-6' completed={progress} height='15px' />
      </div>
    );
  };

  const ChatDiscuss = (props) => {
    console.log('data props', props);
    const { text, userId } = props.info;

    return (
      <div className='flex justify-between p-3 border-b-gray-800'>
        <p className='text-l text-slate-500 capitalize'>
          {text}
        </p>

        <p className='text-slate-500'>
          {userId.name}{" "}
          <img className='w-8 h-8 bg-slate-500 rounded-full' src={userId.profilePic} alt='profile pic' />
        </p>
      </div>
    );
  };

  return (
    <main className='  w-full  flex justify-center items-center bg-slate-100 justify-center'>
      <div className=' bg-white  p-16 mt-8 mb-16'>
        {loading && <Loading />}
        {error && (
          <p className='text-center my-7 text-2xl'>Something went wrong</p>
        )}

        {groupData && !loading && !error && (
          <div className=''>
            <h1 className='text-3xl pt-6 font-semibold text-slate-600'>
              <FaUsers className='inline  w-10 h-10 mx-4' />
              {groupData.name}
            </h1>
            <p className='text-base sm:text-lg mt-3 text-slate-700'>
              <span className='text-semibold text-slate-800'> </span>{" "}
              {groupData.description}
            </p>
            <p className='text-sm text-slate-500 mt-2'>
              created by: {groupData.owner.name} / {groupData.owner.emailId}
            </p>

            <section className='flex flex-wrap gap-4 items-start'>
              <div className='sm:mt-4'>
                <div className='mt-2 w-80 p-6 mt-8 flex flex-col gap-2 bg-slate-200 rounded-lg'>
                  <p className='text-lg'>
                    Send group invite <FaRocket className='inline' />
                  </p>
                  <input
                    type='email'
                    placeholder='email'
                    id='emailId'
                    defaultValue={emailInvite}
                    className='border-slate-700 border p-3 rounded-lg'
                    onChange={(e) => {
                      setEmailInvite(e.target.value);
                    }}
                  />
                  <button
                    onClick={sendEmailInvite}
                    className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90 mt-3'
                  >
                    {" "}
                    Send
                  </button>
                  <ToastContainer autoClose={2000} />
                </div>

                <div className='create-tasks mt-2 w-80 p-6 mt-8 flex flex-col gap-2 bg-slate-200 rounded-lg'>
                  <p className='text-lg'>Create Task</p>
                  <input
                    type='text'
                    placeholder='enter task name'
                    id='taskName'
                    defaultValue={taskName}
                    className='border-slate-700 border p-3 rounded-lg'
                    onChange={(e) => {
                      setTaskName(e.target.value);
                    }}
                  />
                  <input
                    type='text'
                    placeholder='enter task description'
                    id='taskDescription'
                    defaultValue={taskDescription}
                    className='border-slate-700 border p-3 rounded-lg'
                    onChange={(e) => {
                      setTaskDescription(e.target.value);
                    }}
                  />
                  <input
                    type='number'
                    placeholder=' no.of days'
                    id='taskDeadline'
                    defaultValue={taskDeadline}
                    className='border-slate-700 border p-3 rounded-lg'
                    onChange={(e) => {
                      setTaskDeadline(e.target.value);
                    }}
                  />
                  <button
                    onClick={handleTaskBtnClick}
                    className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90 mt-3'
                  >
                    {" "}
                    Create Task
                  </button>
                </div>
              </div>

              <div className='flex-1'>
                <div className='tasks  mt-5'>
                  <h2 className='text-2xl text-slate-700 font-semibold mb-4 mt-8'>
                    <FaTasks className='inline' /> Tasks
                  </h2>
                  {tasksFlag &&
                    tasks &&
                    tasks.length > 0 &&
                    tasks.map((task) => (
                      <TaskItem key={task.taskId} task={task} />
                    ))}

                  <div className='bg-slate-100'>
                    <h3 className='text-xl p-4 rouned-lg'>Discussion/Chat</h3>
                      { console.log(chatDiscussions)}
                    <div className='room p-4'>
                      {chatDiscussionFlag &&
                        chatDiscussions &&
                        chatDiscussions.length > 0 &&
                        chatDiscussions.map((cd) => <ChatDiscuss  info={cd} />)}
                    

                      <input
                        type='text'
                        className='m-4 border-gray-500 border p-2 rounded-lg w-full'
                        value={tempChat}
                        onChange={(e) => {
                          setTempChat(e.target.value);
                        }}
                      />
                      <div className='flex justify-end'>
                        <button
                          onClick={handleDiscussionClick}
                          className=' bg-green-700 text-white p-1 px-16 rounded'
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className='tasks w-full mt-5'>
              <h2 className='text-2xl text-slate-700 font-semibold'>
                {" "}
                Resources <FaExternalLinkAlt className='inline' />
              </h2>
              <div className='flex flex-wrap'>
                <Link className='text-green-400  p-4 '>
                  PDF on javascript arrays
                </Link>
                <Link className='text-green-400 p-4 '>DBMS Notes</Link>
                <Link className='text-green-400 p-4 '>
                  Data structures and Algorithms book
                </Link>
                <Link className='text-green-400 p-4 '>
                  Data Mining class notes
                </Link>
              </div>
            </div>

            <div className='p-4'></div>
          </div>
        )}

        <div className='mt-32'></div>
      </div>
    </main>
  );
}
