import React from 'react';
import LoginForm from './LoginForm';
import callout from"../assets/img/bg-callout.jpg";

export default function Login() {
    return (
        <div class="container-fluid p-0 m-0">
            <div class="row vh-100 position-relative">
                <div class="col-12">
                    <img src={callout} class="img-fluid w-100 h-100 object-fit-cover" alt="login" />
                    <div class="position-absolute top-0 start-10 p-5 text-darkblue">

                    <h1>Login</h1>
                    <div className="login">
                        <LoginForm />
                        </div>

                    </div>
                </div>
            </div>   
        </div>               

    );
}