import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateGroup() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    
    name: "",
    description: "",

  });
 
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);
  console.log(formData);

  const handleChange = (e) => {


    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    console.log(formData);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${currentUser.data.accessToken}`);

      console.log('form josn data', JSON.stringify(formData));
      setLoading(true);
      setError(false);
      const res = await fetch("http://192.168.208.1:8080/api/group", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();
      setLoading(false);
      console.log(data.success);
      if (data.success === false) {
        setError(data.message);
        setGroupCreated(false);
      }

      if (data.status === 'CREATED') {
        setGroupCreated(true);
        console.log('data message', data.message);
        setTimeout(()=> {
          navigate('/dashboard');
        },2000);
        toast(data.message);
        
      }
      console.log('created group data', data);
      
      // navigate(`/view_group/${data.groudId}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Group
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row max-w-2xl gap-4 mx-auto'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />

          <button
            disabled={loading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? "Creating..." : "Create a group"}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
          {groupCreated && <p className='text-green-700 text-sm'>Group created successfully</p>}
          <ToastContainer />
        </div>

      
      </form>
    </main>
  );
}
