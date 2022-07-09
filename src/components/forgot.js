import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';

const Wrapper = styled.div`
    margin-top: 50px;
`;

const Forgot = () => {

    const [email, setEmail] = useState("");

    const sendEmail = (e) => {

        e.preventDefault()
        console.log(email)

        const send = {"email": email}

        axios.post('http://localhost:3001/api/forgot', send).then((result) => {
            
        }, (err) => {
            console.log(err)
        })
    }

    return (
        <Wrapper>
            <div>
                <input type={"text"} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={sendEmail}>Submit</button>
            </div>
        </Wrapper>
    )

}

export default Forgot;