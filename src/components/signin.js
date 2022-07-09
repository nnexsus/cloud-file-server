import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
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

    .signup {
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

const Signin = () => {

    const [showpass, setShowpass] = useState(false);
    const visible = () => setShowpass(!showpass)

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redir, setRedir] = useState(false)

    const handleInput = (e) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);

    };

    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault();

        const data = {
            data: {
            "username": username,
            "password": password,
            }
        };

        axios.post('http://localhost:3001/api/signin', data, {headers: {'content-type': "application/json"}}).then((response) => {
                sessionStorage.setItem("username", response.data.username)
                sessionStorage.setItem("postUsername", response.data.postToken)
                sessionStorage.setItem("pfp", response.data.pfp)
                sessionStorage.setItem("__vnn", response.data.__vnn)
                sessionStorage.setItem("email", response.data.email)
                setRedir("Signed In!")
            }).catch((e) => {
                console.log(e)
            })
        }

    useEffect(() => {
        if (sessionStorage.getItem('postUsername')) {
            navigate('/')
        }
    }, [redir])

    return (
        <Wrapper>
            <div className='formContainer'>
                <form method='post' onSubmit={onSubmit}>
                    <input type={"text"} placeholder="Username/Email" name='username' onChange={handleInput}/>
                    <input type={showpass ? "text" : "password"} placeholder="Password" name='password' onChange={handleInput}/> 
                    <button type='button' value={"none"} onClick={visible} className='showpass'>Show Password</button>
                    <button type='submit' onClick={() => console.log("clicked")}>Sign In</button>
                </form>
                <p>{redir ? redir : null}</p>
            </div>
            <div className='signup'>
                <div>
                    <h2>Or, if you're new:</h2>
                    <a href='/signup'><h3>Sign Up</h3></a>
                </div>
            </div>
        </Wrapper>
    )
}

export default Signin;