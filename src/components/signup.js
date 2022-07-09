import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import validator from 'validator';
import { useNavigate } from 'react-router';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 50px;

    div {
        background-color: var(--60);
        padding: 10px;
        border: solid black 1px;
        border-radius: 10px;
        margin: 10px;
    }

    p, h1, h2, h3 {
        font-family: "Comp";
    }

    p, h1, h2 {
        color: var(--white);
    }

    .signin {
        div {
            background-color: var(--10purple);
            padding: 5px;
            border-radius: 10px;
        }
        a {
            color: var(--10blue);
        }
    }

    .formContainer {

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 40px 0 40px;

        input, button {
            font-family: "Comp";
            color: var(--black);
        }

        input {
            margin: 5px;
            padding: 10px 0 10px 0;
            border: solid black 1px;
            border-radius: 5px;
            text-align: center;
            background-color: var(--veryLightBlue);
        }

        button {
            padding: 10px;
            background-color: var(--10blue);
            border: solid black 1px;
            border-radius: 10px;
            margin: 5px;

            transition: 0.3s ease-in-out;
            cursor: pointer;

            :hover {
                background-color: var(--veryLightBlue);
            }
        }
    }
`;

const Signup = ({onSuccess}) => {

    const [showpass, setShowpass] = useState(false);
    const visible = () => setShowpass(!showpass)

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    const handleInput = (e) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        if (name === 'email') setEmail(value);

    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!validator.isEmail(email)) {
            setEmailError('Email Invalid')
        }

        setEmailError('Email Valid')

        const data = {
            data: {
            'username': username,
            "email": email,
            "password": password,
            }
        };

        axios.post('http://localhost:3001/api/createuser', data, {headers: {'content-type': "application/json"}}).then((response) => {
            toast.success('Account Created')
            onSuccess(response.data)
        }).catch((e) => {
            toast.error('Error creating account.')
        })
    }

    useEffect(() => {
        if (sessionStorage.getItem('postUsername')) {
            navigate('/')
        }
    }, [])

    return (
        <Wrapper>
            <div>
                <form className='formContainer' method='post' onSubmit={onSubmit}>
                    <input type={"text"} value={username} placeholder="Username" name='username' onChange={handleInput}/>
                    <input type={"text"} value={email} placeholder="Email" name='email' onChange={handleInput}/>
                    <input type={showpass ? "text" : "password"} value={password} placeholder="Password" name='password' onChange={handleInput}/> <button value={"none"} onClick={visible} className='showpass'>Show Password</button>
                    <button type='submit'>Sign Up</button>
                    {emailError}
                </form>
            </div>
            <div className='signin'>
                <div>
                    <h2>Or, if you already have an account:</h2>
                    <a href='/signin'><h3>Sign In</h3></a>
                </div>
            </div>
        </Wrapper>
    )
}

export default Signup;