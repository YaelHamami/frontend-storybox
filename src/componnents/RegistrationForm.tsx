import {FC, useEffect, useState} from 'react'
import avatar from "../assets/avatar.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { googleSignin, RegisterData } from '../services/auth-service'
import  AuthClient from '../services/auth-service'
import { uploadPhoto } from '../services/file-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

const schema = z.object({
    email: z.string().email("Invalid email format"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    image: z.instanceof(FileList).optional(),
  });

type FormData = z.infer<typeof schema>;

const RegistrationForm: FC = () => {
    const [file, setFile] = useState<File | null>(null)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const image = watch("image")
    const inputFileRef: {current: HTMLInputElement | null} = {current: null}

    useEffect(() => {
        if(image && image.length > 0) {
            setFile(image[0])
        } // run at page creation and every time image changes
        
    }, [image]);

    const onSubmit = async (data: FormData) => {
        console.log("Form Data Before Sending:", data);
        let imgUrl = ""
        if (data.image && data.image.length > 0) {
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
          {errors.email && <p className="text-danger small">{errors.email.message}</p>}
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            {...register("password")}
            required
          />
          {errors.password && <p className="text-danger small">{errors.password.message}</p>}
          <input
            type="text"
            placeholder="Username"
            className="form-control mb-2"
            {...register("username")}
            required
          />
          {errors.username && <p className="text-danger small">{errors.username.message}</p>}
          <button type="submit" className="btn btn-primary w-100">Sign up</button>
      </div>
    </form>
    )
}

export default RegistrationForm