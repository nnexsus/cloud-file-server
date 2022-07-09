import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { saveAs } from 'file-saver';

const Wrapper = styled.div`

    background-color: var(--darkpurple);
    margin: 30px 250px 30px 250px;
    border: solid black 2px;
    border-radius: 5px;
    padding: 15px;

    p, h1, h2, h3, h4 {
        font-family: "Comp";
    }

    .hidden {
        display: none;
    }

    .fileContainer {
        display: grid;
        //grid-template-columns: repeat(4, 1fr);
        grid-template-columns: ${prop => `repeat(${prop.grid}, ${(100 / (prop.grid))}%)`};

        align-items: center;
    }

    .file {
        padding: 5px;
        margin: 1px;
        border: solid rgba(128,128,128,0.5) 1px;
        border-radius: 15px;
        background-color: var(--darkBlue);
        color: white;
        text-align: center;
        transition: 0.7s ease-in-out;

        .star {
            background-color: rgba(0,0,0,0);
            border: none;
            transition: 0.3s ease-in-out;
            cursor: pointer;

            img {
                width: 50px;
                height: 50px;
            }

            :hover {
                background-color: var(--10blue);
            }
        }

        .srcImg {
            margin: auto;
            width: 80%;
            border-radius: 3px;
            cursor: pointer;
        }

        .mediaFrame {
            background-color: white;
            margin: auto;
            width: 95%;
            border-radius: 5px;
            grid-column-start: 1;
            grid-column-end: 3;
        }

        .author {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px;

            img {
                margin: 15px;
                width: 60px;
                height: 60px;
                border-radius: 10px;
            }
        }

        #delete, #download, #share, #favorite {
            background-color: var(--10blue);
            border: solid black 2px;
            border-radius: 5px;
            width: 25%;
            cursor: pointer;
            transition: 0.7s ease-in-out;

            --aug-inlay-bg: var(--lightPurple);

            img {
                filter: invert(1);
                width: 40%;
                transition: 0.3s ease-in-out;
            }

            :hover {
                img {
                    transform: scale(1.35);
                    filter: invert(0);
                }
            }
        }

        #download:hover {
                background-color: var(--10blue);
                animation: downloadHover 0.5s ease-in-out;
            }

        #delete:hover {
                background-color: var(--alert);
                animation: deleteHover 0.5s ease-in-out;
            }
        
        #share:hover {
                background-color: var(--10purple);
                animation: shareHover 0.5s ease-in-out;
            }

        #favorite:hover {
                background-color: var(--accent);
                animation: favoriteHover 0.5s ease-in-out;
            }

            @keyframes downloadHover {
                    0% {
                    background-color: var(--lightPurple);
                }
                    50% {
                        background-color: var(--30);
                }
                    100% {
                        background-color: var(--10blue);
                }
            }

            @keyframes deleteHover {
                    0% {
                    background-color: var(--lightPurple);
                }
                    50% {
                        background-color: var(--30);
                }
                    100% {
                        background-color: var(--alert);
                }
            }

            @keyframes shareHover {
                    0% {
                    background-color: var(--lightPurple);
                }
                    50% {
                        background-color: var(--30);
                }
                    100% {
                        background-color: var(--10purple);
                }
            }

            @keyframes favoriteHover {
                    0% {
                    background-color: var(--lightPurple);
                }
                    50% {
                        background-color: var(--30);
                }
                    100% {
                        background-color: var(--accent);
                }
            }
    }
`;

const FileSize = styled.p`
    color: ${prop => `rgba(${(prop.size / 10000000) * 5},${(255 - (prop.size / 10000000) * 5)},${(255 - (prop.size / 10000000) * 5)},1)`};
`;


const SingleFile = () => {

    const [file, setFile] = useState(null)
    const [auth, setAuth] = useState(null)
    const [dl, setDl] = useState('')

    const author = sessionStorage.getItem("postUsername")
    const id = useParams()
    const data = {
        author: author
    }

    if (!file) {
        axios.get(`http://localhost:3001/api/get/${id.id}`, data).then((res) => {
            setFile(res.data[0])
        })
    }

    useEffect(() => {
        if (file) {
            axios.get(`http://localhost:3001/api/user/${file.author}`).then((response) => {
                setAuth(response.data[0])
            })
        }
    }, [file, setFile])

    const download = (link, name, type) => {
        saveAs(link, `${name}.${type}`)

        const dData = {
            downloads: file.downloads
        }

        axios.post(`http://localhost:3001/api/download/${file.filename}`, dData).then((response) => {
            setDl(response)
        })
    }

    return (
        <Wrapper>
            <div>
                {file ? 
                <div className='file'>
                    {file.type.includes("image") ? <a className='srcImg' target={"blank"} href={`http://localhost/server/server${file.filename}`}><img width={"80%"} src={`http://localhost/server/server${file.filename}`} alt={`${file.filename}`}/></a> 
                    : file.type.includes("application") ? null :
                    <iframe className='mediaFrame' src={`http://localhost/server/server${file.filename}`} title={`${file.filename}`}/> }
                    <p>{file.type}</p>
                    <p>{file.filename.slice(20)}</p>
                    <p>Uploaded: {file.uploadDate ? file.uploadDate.split("T")[0] : "Unknown"}</p>
                    <FileSize size={file.size}>{file.size > 1000 ? 
                    file.size > 1000000 ? 
                    file.size > 10000000 ? 
                    (file.size / 100000000).toFixed(2) + "GB" : 
                    (file.size / 1000000).toFixed(2) + "MB" : 
                    (file.size / 1000).toFixed(2) + "KB" : 
                    file.size + "B"}</FileSize>
                    {auth && auth.pfp ? 
                    <div className='author'>
                        <p>Uploaded by:</p><img src={`http://localhost/server/server${auth.pfp}`} alt="author profile picture"/><p>{auth.username}</p> 
                    </div>
                    : null}
                    <div className='author'>
                        <p>Downloads: {file.downloads}</p>
                    </div>
                    <div className='buttons'>
                        <button title='download' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='download' onClick={() => download(`http://localhost/server/server${file.filename}`, file.filename.slice(20), file.type.split("/")[1])}><img src='/download.png' alt={`download ${file.filename}`}/></button>
                    </div>
                    {sessionStorage.getItem("postUsername") == file.author ? <h2 style={{color: "white", textAlign: "center"}}>This link is public and secured. Copy and send it to your friends!</h2> : null}
                </div>
                : <div><p>No File selected.</p></div>}
                {dl}
            </div>
        </Wrapper>
    )

}

export default SingleFile;