import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import {toast} from "react-toastify";


const Signup = () => {

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [age, setAge] = useState("");
     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [gender , setGender] = useState("");
     const navigate = useNavigate();


     async function fetchData(){
           const response = await fetch("http://localhost:3000/signup",{
                 method : "POST",
                 headers : {
                            "Content-Type" : "application/json"
                        },
                 credentials: "include",
                 body : JSON.stringify({firstName,lastName,gender,email,password,age: parseInt(age)})
           })
         
           const data = await response.json();
           if(data.msg == "user signed up successfully"){
                toast.success("🎯Signup successful! Redirected to Home... 📊");
                navigate("/");
                return ;
           }else {
               toast.error(data.detailError || data.msg);
               return ;
           }
     }


     function handleInput(event){
         event.preventDefault();

         if(!email || !password || !firstName || !age || !gender){
              toast.error("plz enter all the fields")
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

         if(parseInt(age) < 16){
              toast.error("minimum age should be 16 yrs required");
              return ;
         }

         if(firstName.length <3 || firstName.length >=50){
                 toast.error("first Name must be more than 2 characters long and less than 50 characters")
         }

         setEmail("");
         setPassword("");
         setAge("");
         setFirstName("");
         setLastName("");

         fetchData();

     }


  return (
    <div className="min-h-screen flex justify-center mt-10 ">
        <form onSubmit={handleInput}  >
            <fieldset className="fieldset bg-base-300 border-gray-600 rounded-box w-xs border px-4 pt-0">

           <Link to={"/login"}>
               <button className="text-2xl ml-2 text-blue-500 cursor-pointer hover:text-blue-600">Already have an account?</button>
            </Link>

            <legend className="fieldset-legend text-4xl text-center mb-4">Signup</legend>

            <input autoFocus required type="text" className="input mt-4" placeholder="Enter FirstName" value={firstName} onChange={(event)=>setFirstName(event.target.value)} />

            <input  type="text" className="input mt-4" placeholder="Enter LastName" value={lastName} onChange={(event)=>setLastName(event.target.value)} />

            <input required type="email" className="input mt-4" placeholder="Enter Email" value={email} onChange={(event)=>setEmail(event.target.value)} />

            <input required type="password" className="input mt-4" placeholder="Enter Password" value={password} onChange={(event)=>setPassword(event.target.value)} />

            <input required type="number" className="input mt-4" placeholder="Enter Age" value={age} onChange={(event)=>setAge(event.target.value)} />

            <select  onChange={(event)=>setGender(event.target.value)}  defaultValue="Choose A Gender" className="select mt-4">
                <option disabled={true}>Choose A Gender</option>
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
                <option value={"others"}>Others</option>
            </select>

            <button className="btn btn-neutral mt-7 mb-5 border-white hover:bg-lime-500 text-xl hover:text-black">Login</button>

            </fieldset>
        </form>
    </div>
  );
};

export default Signup;
