import { useParams } from 'react-router';
import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';

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

    p, h1, h2, h3 {
        color: var(--white);
    }

    a {
        color: var(--10blue);
    }

    .formContainer {
        background-color: var(--10purple);
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

const Reset = () => {

    const [pass, setPass] = useState('');
    const [togglePass, setTogglePass] = useState(false);
    const [resStatus, setResStatus] = useState('')

    var token = useParams()

    const rstPass = () => {

        const data = {
            "newpass": pass
        }

        axios.post(`http://localhost:3001/api/reset/${token.id}`, data).then((response) => {
            setResStatus(response.data.message)
        }).catch((e) => {
            console.log(e)
            setResStatus(e)
            return
        })

    }

    return (
        <Wrapper>
            <h1>Reset Password</h1>
            <div>
                <div className='formContainer'>
                    <input type={togglePass ? "text" : "password"} placeholder='New Password' onChange={(e) => setPass(e.target.value)} /><button onClick={() => setTogglePass(!togglePass)}>Show Password</button>
                    <button onClick={() => rstPass()}>Reset</button>
                    <p>{resStatus ? resStatus : null}</p>
                </div>
            </div>
        </Wrapper>
    )

}

export default Reset;