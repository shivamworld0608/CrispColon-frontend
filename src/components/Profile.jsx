import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [sendImage, setSendImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPic, setIsUpdatingPic] = useState(false); // New state for profile pic update
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dob: '', gender: '', profilePic: '' });
  const [showAllImages, setShowAllImages] = useState(false);

    // Create a ref for the file input
    const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Unauthorized: No token found');
          return;
        }

        const response = await axios.get("http://localhost:5000/profile/get", {
          withCredentials: true,
        });

        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          dob: response.data.user.dob,
          gender: response.data.user.gender,
          profilePic: response.data.user.profilePic,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user profile');
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicUpdateToggle = () => {
    setIsUpdatingPic(!isUpdatingPic);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSendImage(e.target.files[0]);
    }
  };

  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    if (!sendImage) return;

    try {
      const form = new FormData();
      form.append('file', sendImage);
      const token = Cookies.get('token');

     const response = await axios.put("http://localhost:5000/profile/update-picture", form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  //I can use response.data.user.profilePic here but for quick working i am using this
      setUser((prevUser) => ({ ...prevUser, profilePic: URL.createObjectURL(sendImage) }));
      setIsUpdatingPic(false);
      setSendImage(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile picture');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.put("http://localhost:5000/profile/update",formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };
  const triggerFileInput = () => {
    // Trigger the file input programmatically
    fileInputRef.current.click();
    setIsUpdatingPic(!isUpdatingPic);
  };
  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-1">
      <div className="shadow rounded-3xl overflow-hidden w-full max-w-xxl border-2 border-neutral-500">
        {/* Cover Section */}
        <div className="relative bg-gradient-to-r from-orange-900 bg-cover bg-no-repeat h-40" >
          <div className="absolute inset-0 opacity-50"></div>
        </div>

        {/* Profile Section */}
        <div className="relative -mt-12 text-center">
          <button onClick={triggerFileInput} >
          <img
            src={user.profilePic || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"}
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto border-4 border-green-600"
          />
          </button>
            {/* File input is now hidden, but triggered when the profile pic is clicked */}
            <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {isUpdatingPic && (
            <div className="mt-4">
              <button onClick={handleProfilePicSubmit} className="bg-green-500 text-white px-4 py-1 border border-green-400 rounded">Upload</button>
              <button onClick={handleProfilePicUpdateToggle} className="ml-2 bg-red-500 text-white px-4 py-1 border border-red-400 rounded">Cancel</button>
            </div>
          )}

          {isEditing ? (
            <div>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="mt-2 p-2 mx-2 border border-orange-300 rounded" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="mt-2 p-2 mx-2 border border-orange-300 rounded" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile" className="mt-2 mx-2 p-2 border border-orange-300 rounded" />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="DOB" className="mt-2 mx-2 p-2 border border-orange-300 rounded" />
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="mt-2 mx-2 p-2 border border-orange-300 rounded" />
              <button onClick={handleSubmit} className="mt-4 mx-2 bg-orange-500 text-white px-4 py-1 border border-orange-400 rounded">Save</button>
              <button onClick={handleEditToggle} className="mt-4 ml-2 bg-red-500 text-white px-4 py-1 border border-red-400 rounded">Cancel</button>
            </div>
          ) : (
            <div>
              <h4 className="mt-4 text-3xl font-semibold text-orange-500">{user.name}</h4>
              <p className="mt-1 text-gray-400">{user.subscription} Subscriber</p>
              <button onClick={handleEditToggle} className="bg-orange-500 text-white mt-5 px-4 py-1 border border-orange-400 rounded">Edit Profile</button>
            </div>
          )}
        </div>
        
           {/* About Section */}
           <div className="mt-6 px-6 py-4">
          <h5 className="mb-3 ml-4 font-bold text-orange-500">About</h5>
          <div className="p-4 bg-neutral-800 border border-neutral-300 rounded-3xl">
            <div className="flex mb-6 mt-4">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <p className="pt-2 font-italic mb-1 tracking-tight">Name: {formData.name}</p>
            </div>
            <div className="flex mb-6">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <p className="font-italic mb-1 tracking-tight">Email: {formData.email}</p>
            </div>
            <div className="flex mb-6">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <p className="pb-2 font-italic mb-0 tracking-tight">Mobile: {formData.phone}</p>
            </div>
            <div className="flex mb-6">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <p className="font-italic mb-1 tracking-tight">DOB: {formData.dob}</p>
            </div>
            <div className="flex mb-6">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <p className="font-italic mb-1 tracking-tight">Gender: {formData.gender}</p>
            </div>
          </div>
        </div>

        {/* Recent Photos Section */}
        <div className="px-6 py-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h5 className="mb-2 ml-4 font-semibold text-orange-500">Recent Checked X-Ray</h5>
            <button onClick={() => setShowAllImages(!showAllImages)} className="text-sm text-orange-600">
              {showAllImages ? 'Show less' : 'Show all'}
            </button>
          </div>
          <div className={`grid ${showAllImages ? 'grid-cols-5' : 'grid-cols-5'} gap-4`}>
            {user.history.slice(0, showAllImages ? user.history.length : 5).map((item, index) => (
              <img
                key={index}
                src={item.images[0]}
                alt={`Recent ${index}`}
                className="rounded bg-grey900 shadow w-full h-40 object-contain border border-neutral-300 rounded-3xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;




