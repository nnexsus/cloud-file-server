import axios from 'axios';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const Wrapper = styled.div`

    .toasts {
            position: fixed;
            color: var(--whiteBlue);
            background-color: var(--10purple);
            padding: 30px 30px 30px 30px;
            z-index: 10;
            font-size: 20px;

            --aug-inlay-bg: var(--10purple);
            --aug-br-inset1: 110px;
            --aug-br1-alt-join-in: 0px;
            --aug-br1-alt-join-out: 0px;
            bottom: 10px;
            left: 10px;
            font-size: 20px;
        }

    .signin {
                div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    background-color: var(--60);
                    border-radius: 5px;
                }

                font-family: "Comp";
                p {
                    color: var(--white);
                }
                a {
                    color: var(--whiteBlue);
                    padding: 10px;
                    border: solid black 1px;
                    border-radius: 10px;
                    background-color: var(--10purple);
                    margin: 10px;
                }

                margin: 10px;
                padding: 10px;

                background-color: var(--grayBlue);
                border: solid black 2px;
                border-radius: 2px;
            }
            a, p, h1, h2, h3, h4, button, form {
        font-family: Comp;
        font-variant-caps: petite-caps;
    }

    h1, h2 {
        //-webkit-text-stroke: 1px black;
        font-weight: 100;
    }

    .form {
        padding: 20px;
        margin: 0 auto;
        background-color: var(--grayBlue);
        border: solid black 2px;
        margin-top: 10px;
        border-radius: 3px;
        text-align: center;
        color: white;
    }

    .formFloat {
        border: solid 1px black;
        border-radius: 5px;
        width: 50%;
        min-height: 150px;
        margin: 0 auto;

        --aug-l-inset1: 30px;
        --aug-r-inset1: 30px;
        --aug-l-center: 76px;
        --aug-r-center: 76px;
        --aug-l1-alt-join-in: 0px;
        --aug-l2-alt-join-out: 0px;
        --aug-r1-alt-join-in: 0px;
        --aug-r2-alt-join-out: 0px;
        --aug-inlay-bg: var(--lightPurple);
        --aug-border-all: 1px;
        --aug-border-bg: var(--darkBlue);
        filter: drop-shadow(0px 0px 10px black);
    }

    .fileForm {
        width: min-content;
        margin: 0 auto;
        margin-top: -15px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fileInput {
        display: none;
    }

    .label {
        margin-bottom: 7px;
        padding: 10px;
        padding-bottom: 13px;
        inline-size: max-content;
        padding-right: 1000%;
        padding-left: 1000%;
        background: var(--darkBlue);
        border-radius: 5px;
        box-shadow: 0px 0px 6px 0px black;
        font-family: 'Comp';
        transition: 0.3s ease-in-out;
        cursor: pointer;
        
        :hover {
            color: black;
            background-color: var(--accent);
            transform: scale(1.01);
            box-shadow: 0px 0px 12px 0px black;
        }
    }

    .submit {
        background-color: var(--10blue);
        border: solid black 1px;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0px 0px 6px 0px black;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        :hover {
            background-color: var(--accent);
            transform: scale(1.1);
            box-shadow: 0px 0px 12px 0px black;
        }
    }

    .usage, .settings {
        margin: 50px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: var(--grayBlue);
        font-family: "Comp";
        color: var(--whiteBlue);
        border: solid black 1px;
        border-radius: 10px;

        button {
            margin: 10px;
            background-color: var(--accent);
            border: black solid 2px;
            border-radius: 10px;
            padding: 5px;
            cursor: pointer;
            box-shadow: 0px 0px 0px 2px white;
            transition: 0.1s ease-in-out;

                :hover {
                    box-shadow: 0px 0px 0px 8px white;
                }
        }

        .deleteConfirm {
            background-color: var(--alert);
        }

        input[type=password] {
            padding: 20px;
            background-color: var(--accent);
            margin: 10px;
            border: solid black 2px;
            border-radius: 10px;
            font-family: "Comp";
            color: var(--alert);
        }
    }
`;

const RadialProgress = styled.div`

    .circle-wrap {
        margin: 20px;
        width: 150px;
        height: 150px;
        background: var(--grayBlue);
        border-radius: 50%;
    }

    .circle-wrap .circle .mask, .circle-wrap .circle .fill {
        width: 150px;
        height: 150px;
        position: absolute;
        border-radius: 50%;
    }

    .circle-wrap .circle .mask {
        clip: rect(0px, 150px, 150px, 75px);
    }

    .circle-wrap .inside-circle {
        width: 122px;
        height: 122px;
        border-radius: 50%;
        background: var(--whiteBlue);
        line-height: 120px;
        text-align: center;
        margin-top: 14px;
        margin-left: 14px;
        font-family: "Comp";
        color: ${prop => `rgba(${(prop.size / 10000000) * 5},${(255 - (prop.size / 10000000) * 5)},${(255 - (prop.size / 10000000) * 5)},1)`};
        position: absolute;
        z-index: 100;
        font-weight: 700;
        font-size: 2em;
    }

    .mask .fill {
        clip: rect(0px, 75px, 150px, 0px);
        background-color: ${prop => `rgba(${(prop.size / 10000000) * 5},${(255 - (prop.size / 10000000) * 5)},${(255 - (prop.size / 10000000) * 5)},1)`};;
    }

    .mask.full, .circle .fill {
        animation: fill ease-in-out 3s;
        transform: ${prop => `rotate(${prop.value * 1.8}deg)`};
    }

    @keyframes fill{
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: ${prop => `rotate(${prop.value * 1.8}deg)`};
        }
    }
`;

const Account = () => {

    const [files, setFiles] = useState([]);
    const [filename, setFilename] = useState([]);
    const [uploadedFile, setUploadedFile] = useState([]);
    const [usageset, setUsageSet] = useState(false);
    const [usage, setUsage] = useState([]);
    const [del, setDel] = useState(false);
    const [password, setPassword] = useState('');
    const [favoriteRes, setFavoriteRes] = useState('');
    const [showToast, setShowToast] = useState(false);

    const pass = (e) => {setPassword(e.currentTarget.value)}

    const onChange = (e) => {
        setFiles(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const username = sessionStorage.getItem("username")

        const data = new FormData();

        data.append('file', files)
        data.append('username', username)

        const res = await axios.post(`http://localhost:3001/api/user/pfp/${username}`, data, {headers: {'content-type': "multipart/form-data"}}).then((response) => {
                setFavoriteRes('Upload Successful');
            }).catch((e) => {
                setFavoriteRes(`Upload Failed: ${e}`);
            })

        const {fileName, file} = res;
        setUploadedFile({fileName, file})
    };

    const username = sessionStorage.getItem("postUsername")

    if (!usageset) {
        axios.get(`http://localhost:3001/api/user/data/${username}`).then((response) => {
            console.log(response)
            setUsage(response.data)
        })
    }

    const deleteAccount = () => {
        const data = {
            "username": username,
            "password": password,
        }

        axios.post(`http://localhost:3001/api/user/deleteall`, data, {headers: {'content-type': "application/json"}}).then((response) => {
            console.log(response)
            setUsage(response.data)
        })
    }

    const sendEmail = () => {
        const email = sessionStorage.getItem('email')
        const data = {
            "email": email
        }

        axios.post(`http://localhost:3001/api/forgot/`, data, {headers: {'content-type': "application/json"}}).then((response) => {
            console.log(response)
            setUsage(response.data)
        })
    }

    useEffect(() => {
        setTimeout(() => {
            setShowToast(false)
        }, 3000)
    }, [favoriteRes])

    useEffect(() => {
        setUsageSet(true)
    }, [usage])

    return (
        <Wrapper>
            {sessionStorage.getItem("username") ? 
            <div>
                    <div className='form'>
                        <div className='formFloat' data-augmented-ui="tl-2-clip-y tr-2-clip-y r-clip br-2-clip-y bl-2-clip-y l-clip both">
                            <h2>Change Profile Picture</h2>
                            <form className='fileForm' method='post' action='#' id='upload' onSubmit={onSubmit}>
                                <label htmlFor="fileInput" className='label'>Upload File...</label>
                                <input type="file" onChange={onChange} className="fileInput" id='fileInput' multiple/>
                                {filename}
                                <button className='submit' type='submit'>Submit</button>
                            </form>
                        </div>
                    </div>
                    {usageset ? 
                    <div className='usage'>
                        <h2>Storage Used</h2>
                        <label htmlFor="usage">~{usage.percentUsed}% used of 50Gb. [{usage.size} bytes / {usage.totalSize} bytes]</label>
                        <RadialProgress id="radial" value={usage.percentUsed} size={usage.size}>
                            <div className="circle-wrap">
                                <div className="circle">
                                    <div className="mask full">
                                        <div className="fill"></div>
                                    </div>
                                    <div className="mask half">
                                        <div className="fill"></div>
                                    </div>
                                    <div className="inside-circle"> {usage.percentUsed}% </div>
                                </div>
                            </div>
                        </RadialProgress>
                    </div>
                    : null}
                    <div className='settings'>
                        <button className='password' onClick={() => sendEmail()}><p>Change Password</p></button>
                        <button className='delete' onClick={() => setDel(!del)}><p>Delete Account</p></button>
                        {del ? 
                            <form onSubmit={deleteAccount}>
                                <input value={password} placeholder="Password" type="password" onChange={pass}/>
                                <button className='deleteConfirm'><p>Confirm Deletion</p></button> 
                                <p style={{color: "var(--alert)", backgroundColor: "var(--black)", padding: "10px", borderRadius: "10px"}}>This will delete all your uploaded files! Recovery will not be availble!</p>
                            </form>
                        : null}
                    </div>
            </div>       
            : 
            <div className='signin'>
                <div>
                    <p>Sign in or sign up to upload and view your files.</p>
                    <a href='/signin'>Sign In</a>
                    <a href='/signup'>Sign Up</a>
                </div>
            </div>}
        </Wrapper>
    )

}

export default Account;