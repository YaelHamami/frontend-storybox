import {FC, useEffect, useState} from 'react'
import avatar from "../assets/avatar.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
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
        <form style={{
            width: "100vw", 
            height: "100vh", 
            background: "",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}
            onSubmit={handleSubmit(onSubmit)}>

            <div className="d-flex flex-column" style={{backgroundColor: "lightgray", padding: '20px', borderRadius: '10px'}}>
                <div className='mb-3' style={{alignSelf: "center"}}>StoryBox</div>
                <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                    <img src={file?URL.createObjectURL(file) : avatar} alt='' style={{width: '150px', height: '150px', alignSelf: 'center'}}/>
                    <FontAwesomeIcon onClick={() => {inputFileRef.current?.click()}} icon={faImage} className="fa-xl" style={{position: 'absolute', bottom: '0', right: '0'}}/>
                </div>
                <input {...rest} ref={(e) => { ref(e); inputFileRef.current = e }} type="file" className='mb-3' accept='image/jpeg, image/png' style={{display: 'none'}}/>
                <label>email:</label>
                <input {...register("email")} type="text" placeholder='email' className='mb-3'/>
                <label>password:</label>
                <input {...register("password")} type="password" placeholder='passsword' className='mb-3'/>
                <label>user name:</label>
                <input {...register("username")} type="text" placeholder='username' className='mb-3'/>
                <button type='submit' className='btn btn-outline-primary mb-3'>Register</button>
                < GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}/>
            </div>
        </form>
    )
}

export default RegistrationForm