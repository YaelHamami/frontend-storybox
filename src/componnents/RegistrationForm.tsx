import {FC, useEffect, useState} from 'react'
import avatar from "../assets/avatar.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useForm } from 'react-hook-form'
import { googleSignin, RegisterData } from '../services/auth-service'
import  AuthClient from '../services/auth-service'
import { uploadPhoto } from '../services/file-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'


interface formData {
    email: string,
    username: string,
    password: string,
    image: File[]
}

const RegistrationForm: FC = () => {
    const [file, setFile] = useState<File | null>(null)
    const { register, handleSubmit, watch } = useForm<formData>();
    const image = watch("image")
    const inputFileRef: {current: HTMLInputElement | null} = {current: null}

    useEffect(() => {
        if(image) {
            console.log(image)
            setFile(image[0])
        } // run at page creation and every time image changes
        
    }, [image]);

    const onSubmit = async (data: formData) => {
        console.log("Form Data Before Sending:", data);
        let imgUrl = ""
        if (data.image[0]) {
            imgUrl = await uploadPhoto(data.image[0])

        }
        
        const regData: RegisterData = {
            email: data.email,
            userName: data.username,
            password: data.password,
            profile_picture_uri: imgUrl
        };
        try{
            const { request } = AuthClient.authRegister(regData);
            request.then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            console.log(credentialResponse)
            const response = await googleSignin(credentialResponse)
            console.log(response)
            
        } catch (err) {
            console.log(err)
        }
        

    }
    const onGoogleLoginFailure = () => {
        console.log("Google login Failed")
    }

    const {ref, ...rest} = register("image")

    return (
        // <form style={{
        //     width: "100vw", 
        //     height: "100vh", 
        //     background: "",
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center"
        //     }}
        //     onSubmit={handleSubmit(onSubmit)}>

        //     <div className="d-flex flex-column" style={{backgroundColor: "lightgray", padding: '20px', borderRadius: '10px'}}>
        //         <div className='mb-3' style={{alignSelf: "center"}}>StoryBox</div>
        //         <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
        //             <img src={file?URL.createObjectURL(file) : avatar} alt='' style={{width: '150px', height: '150px', alignSelf: 'center'}}/>
        //             <FontAwesomeIcon onClick={() => {inputFileRef.current?.click()}} icon={faCamera} className="fa-xl" style={{position: 'absolute', bottom: '0', right: '0'}}/>
        //         </div>
        //         <input {...rest} ref={(e) => { ref(e); inputFileRef.current = e }} type="file" className='mb-3' accept='image/jpeg, image/png' style={{display: 'none'}}/>
        //         <label>email:</label>
        //         <input {...register("email")} type="text" placeholder='email' className='mb-3'/>
        //         <label>password:</label>
        //         <input {...register("password")} type="password" placeholder='passsword' className='mb-3'/>
        //         <label>user name:</label>
        //         <input {...register("username")} type="text" placeholder='username' className='mb-3'/>
        //         <button type='submit' className='btn btn-outline-primary mb-3'>Register</button>
        //         < GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}/>
        //     </div>
        // </form>
    <form className="d-flex justify-content-center align-items-center min-vh-100 bg-light" onSubmit={handleSubmit(onSubmit)}>
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center font-weight-bold mb-3">StoryBox</h2>
        <p className="text-center text-muted">
          Sign up to see stories from your friends.
        </p>
        <div className="d-flex justify-content-center mb-3">
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
        </div>
        <div className="text-center text-muted mb-2">OR</div>
          {/* <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
            <img src={file?URL.createObjectURL(file) : avatar} alt='' style={{width: '150px', height: '150px', alignSelf: 'center'}}/>
            <FontAwesomeIcon onClick={() => {inputFileRef.current?.click()}} icon={faImage} className="fa-xl" style={{position: 'absolute', bottom: '0', right: '0'}}/>
          </div>
          <input {...rest} ref={(e) => { ref(e); inputFileRef.current = e }} type="file" className='mb-3' accept='image/jpeg, image/png' style={{display: 'none'}}/> */}
                  <div className="d-flex justify-content-center position-relative mb-3">
          <img 
            src={file ? URL.createObjectURL(file) : avatar} 
            alt="Profile Avatar" 
            className="rounded-circle border shadow" 
            style={{ width: "120px", height: "120px", objectFit: "cover" }} 
          />
          <FontAwesomeIcon 
            onClick={() => inputFileRef.current?.click()} 
            icon={faCamera} 
            className="position-absolute bg-white p-2 rounded-circle shadow" 
            style={{ bottom: "0", right: "10px", cursor: "pointer", fontSize: "1.2rem" }}
          />
        </div>
        <input {...rest} ref={(e) => { ref(e); inputFileRef.current = e; }} type="file" className="d-none" accept="image/jpeg, image/png" />
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            {...register("email")}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            {...register("password")}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="form-control mb-2"
            {...register("username")}
            required
          />
          <button type="submit" className="btn btn-primary w-100">Sign up</button>
      </div>
    </form>
    )
}

export default RegistrationForm