import { useState  } from "react";
import { useNavigate , Link } from "react-router-dom";
import {toast} from "react-toastify";


const Login = () => {

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const navigate = useNavigate();


     async function fetchData(){
           const response = await fetch("http://localhost:3000/signin",{
                 method : "POST",
                 headers : {
                     "Content-Type" : "application/json"
                    },
                 credentials: "include",
                 body : JSON.stringify({email,password})
           })
         
           const data = await response.json();
           if(data.msg == "user logged in successfully"){
                toast.success("🎯Login successful! Redirected to Home... 📊");
                navigate("/");
                return ;
           }else {
               toast.error(data.detailError || data.msg);
               return ;
           }
     }


     function handleInput(event){
         event.preventDefault();

         if(!email || !password){
              toast.error("enter all fields")
              return ;
         }

         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if(!emailRegex.test(email)){
              toast.error("invalid email format");
              return ; 
         }

         if(password.length<6 || password.length >30){
              toast.error("password must be 6 characters long and less than 30 characters")
              return ;
         }

         setEmail("");
         setPassword("");

         fetchData();

     }


  return (
    <div className="min-h-screen flex justify-center mt-10 ">
        <form onSubmit={handleInput}  >
            <fieldset className="fieldset bg-base-300 border-gray-600 rounded-box w-xs border px-4 pt-0">
            <Link to={"/signup"}>
               <button className="text-2xl mb-3 ml-4 text-blue-500 cursor-pointer hover:text-blue-600">Don't have an account?</button>
            </Link>

            <legend className="fieldset-legend text-4xl text-center mb-5">Login</legend>

            <label className="label text-xl mb-2">Email</label>
            <input autoFocus required type="email" className="input" placeholder="Email" value={email} onChange={(event)=>setEmail(event.target.value)} />

            <label className="label mt-8 text-xl mb-2">Password</label>
            <input required type="password" className="input" placeholder="Password" value={password} onChange={(event)=>setPassword(event.target.value)} />

            <button className="btn btn-neutral mt-10 mb-10 border-white hover:bg-lime-500 text-xl hover:text-black">Login</button>
            </fieldset>
        </form>
    </div>
  );
};

export default Login;
