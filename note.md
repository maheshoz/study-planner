

```sh
npm create vite@latest client
npm install
npm run dev
```

https://tailwindcss.com/docs/guides/vite

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
index.css

@tailwind base;
@tailwind components;
@tailwind utilities;
```
npm run dev

extensions - tailwing intellisence, console ninja, es7 snippets

https://github.com/sahandghavidel/mern-estate


```
npm install react-router-dom
```
Create the pages and routes
```js
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Profile from "./pages/Profile"

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/profile" element={<Profile />}/>

    </Routes>
  </BrowserRouter>
}
```

```
npm i react-icons
```
create and add the navbar and installed react-icons package

```js
import {FaSearch} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div>
        <Link to='/'>
         ....
        </Link>
         <form >
          <input type="text" placeholder='Search...'/>
          <FaSearch className="text-slate-600"/>
        </form>

        <ul className="flex gap-4">
          <Link to='/'>
           ..
          </Link>
          <Link to='/about'>
           ..
          </Link>
          <Link to='/sign-in'>
           ..
          </Link>
        </ul>

      </div>
    </header>
  )
}

```

API
- npm init -y
- npm install express
- npm install nodemon or install as devDependency

```js
 "scripts": {
    "dev": "nodemon api/index.js",
    "start": "node api/index.js"
  },
```
npm run dev

### Connect to DB

`npm i mongoose`
login to mongoDB site, create a new project 'mern-estate', create a DB
create username, pswd
select cloud environment
0.0.0.0 ip address to access from anywhere
finish , copy the URI

```js
mongoose.connect("mongodb+srv://username:password@mern-estate.3333r33.mongodb.net/clusterName?retryWrites=true&w=majority")
```
install `dotenv` package , to use `process.env.MONGO_URI`
```sh
npm install dotenv
```

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000 !");
});

```

### Create user model

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: string,
    required: true
  }
}, { timestamps: true}); //for created, updated timestamps

const User = mongoose.model('User', userSchema); // use Singular 'User', mongoDB will create Users table/document

export default User;
```

When we do POST to http://localhost:3000/api/auth/signup we get undefined from req.body
we need to allow json parsing in server, add below middleware
```js
app.use(express.json());
```

install bcryptjs to has the password
```js
$ npm i bcryptjs
```

```js
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  console.log(req.body);

  const { username, email, password} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({username, email, password: hashedPassword});

  try {
    await newUser.save()
    res.status(201).json("User created successfully");
    
  } catch (error) {
    res.status(500).json(error.message)
  }
}
```


create proxy for api's in client
```js
//vite.config.js

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target : 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
})

```


### sigin api route

install jwt
`npm i jsonwebtoken`

add `JWT_SECRET = "asdfa"` in .env file

```js
export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email});
    console.log('validUser - ', validUser);
    if(!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong Credentials!'));

    const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET);
    console.log(token);
    // res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 *60 * 10)}); // expires in 10 days
    // res.cookie('access_token', token, { httpOnly: true}); // will work as session 
    // destructure validuser to remove password keyvalue as we send it in response
    const {password: pass, ...rest} = validUser._doc;
    console.log('pswd - ',pass );
    console.log('destructred data ', rest);
    res
      .cookie('access_token', token, {httpOnly : true})
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
}
```


### add redux-toolkit to persist user data

https://redux-toolkit.js.org/tutorials/quick-start

installing in the client side
```sh
npm install @reduxjs/toolkit react-redux
```

```js
//store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice.js'

export const store = configureStore({
  reducer: {user: userReducer},
  // middleware to remove browser error for serialzing
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

```

```js
//userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser : null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  }
});
console.log(userSlice);

export const { signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;
```

```js
//SignIn.jsx

import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
 ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      // setLoading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message));
    }

```

install Redux DevTools chrome extension

on reload, the redux states/snapshots are lost so we will new package redux-persist to have redux state changes

```sh
npm i redux-persist
```
https://www.npmjs.com/package/redux-persist

```js
// store.js

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({user: userReducer});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
```

```js
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

  <Provider store={ store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
```

### add google OAuth

create button component

create a new project in firebase

```sh
npm install firebase
```
create new .env and hide the firebase API key
choose google provider from Auth menu


use http://localhost:5173/sign-in 

OAuth component
```js
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log('signIn result ' + result);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");

    } catch (error) {
      console.log("could not sign in with google ", error);
    }
  };
  
  return (
      <button
        onClick={handleGoogleClick}
        type='button'>Continue with Google </button>
  );
}

```
google controller

```js

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // if user exists 
    if (user) {
      const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest} = user._doc;
      res
        .cookie('access_token', token, { httpOnly : true })
        .status(200)
        .json(rest);
    } else {
    // if doesn't exist, create random pswd and add, generate username from res name, add photo
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
     
      const newUser = new User({ 
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest} = newUser._doc;
      
      res
        .cookie('access_token', token, { httpOnly : true })
        .status(200)
        .json(rest);

    }
  } catch (error) {
    next(error)
  }
}
```

### file upload

Firebase storage

rules - allow all type of images and if size is less than 2MB
2 * 1024(1KB) * 1024(1KB) , 2 * 1MB
```js
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
```

install cookie-parser to access the cookie from cilent in nodejs server

```sh
npm i cookie-parser
```

```js
req cookies  {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWQ2Zjk4YmZiYmU1Zjg1YTdlYWI0NSIsImlhdCI6MTcwNjE4NTcwNH0.mUFkZW6eHyxzwx1JD8HLMXnykMC_S_RExB4bt6coX_Q'
}
updateUser request body { username: 'userOne' }
updateUser request params  { id: '65ad6f98bfbbe5f85a7eab45' }
updateUser request user  { id: '65ad6f98bfbbe5f85a7eab45', iat: 1706185704 }
```

delete User

```js
// controller
export const deleteUser = async (req, res, next) => {

  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'));

  try {
    await User.findByIdAndDelete(req.params.id);
    // clear cookie in client
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
}

//Profile.jsx
 const handleDeleteUser = async () => {
    try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        // console.log('delete data', data);
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
```

SignOut user

```js
//controller
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error)
  }
}

//jsx
  const handleSignOut = async ()=> {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if( data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
```

install swiper 

```sh
npm i swiper
```

```jsx
...
import { Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
  SwiperCore.use( [Navigation]);
  ...

  return (
    ...
    {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[500px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      ...
  )
}
```
format amount
```js
(123456.789).toLocaleString('en-US')
// '123,456.789'
(123456.789).toLocaleString('hi') // hindi
// '1,23,456.789'
```

https://www.npmjs.com/package/@tailwindcss/line-clamp

```sh
npm install -D @tailwindcss/line-clamp
```
line-clamp is installed by default in tailwaind new version


Before deployment

add build script in server package.json
```js
  "scripts": {
    "dev": "nodemon api/index.js",
    "start": "node api/index.js",
    "build": "npm install && npm install --prefix client && npm run build --prefix client"
  },


```


index.js
```js
...
import path from "path";

const __dirname = path.resolve();
...
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

```
import the repo in render and connect
![Alt text](image.png)

choose free type and add env variables
JWT_SECRET, MONGO, VITE_FIREBASE_API_KEY

in firebase, add the deployed url in Authenticatoin>settings>Authorized domains 