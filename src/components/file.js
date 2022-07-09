import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components';
import FileViewer from './fileviewer';

const Wrapper = styled.div`

    .verify {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background-color: var(--60);
        border-radius: 5px;

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

    @media screen and (max-width: 675px) {
        p {
            font-size: 12px;
        }
        h1, form {
            font-size: 70%;
        }
        h2 {
            font-size: 16px;
        }

        .formFloat {
            --aug-l-center: 576px;
            --aug-r-center: 576px;

            h2 {
                margin-bottom: 40px;
            }
        }
    }
`;

const File = () => {

    const [files, setFiles] = useState([]);
    const [filename, setFilename] = useState([]);
    const [uploadedFile, setUploadedFile] = useState([]);
    const [resText, setResText] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setFiles(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const username = sessionStorage.getItem("postUsername")

        const data = new FormData();

        data.append('file', files)
        data.append('username', username)

        const res = await axios.post("http://localhost:3001/api/create", data, {headers: {'content-type': "multipart/form-data"}}).then((response) => {
                setResText(response.data.message)
                setLoading(false)
            }).catch((e) => {
                setLoading(false)
                setResText("File upload failed. Please make sure you're not exceeding your file limit. You can check in your profile.")
            })
    };

    return (
        <Wrapper>
            {sessionStorage.getItem("postUsername") ? 
            <div>
                {sessionStorage.getItem('__vnn') == 1 ? 
                
                <div className='form'>
                    <div className='formFloat' data-augmented-ui="tl-2-clip-y tr-2-clip-y r-clip br-2-clip-y bl-2-clip-y l-clip both">
                        <h2>Upload Files</h2>
                        <form className='fileForm' method='post' action='#' id='upload' onSubmit={onSubmit}>
                            <label htmlFor="fileInput" className='label'>Upload Files...</label>
                            <input type="file" onChange={onChange} className="fileInput" id='fileInput' multiple/>
                            {filename}
                            <button className='submit' type='submit'>Submit</button>
                            {loading ? <img src='' alt='loading' className='loadingBar' /> : null}
                            {resText}
                        </form>
                    </div>
                </div>
                :<div className='verify'>
                    <p>Verify your account to upload files. Verification should already be in your email. If not, click: </p><a href='/sendverify'>here</a>
                </div>}
                <FileViewer></FileViewer>
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

export default File;