import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';


const Wrapper = styled.div`

    a, p, h1, h2, h3, h4, button, form {
        font-family: Comp;
        font-variant-caps: petite-caps;
    }

    .title {
        color: white;
        text-align: center;
    }

    .hidden {
        display: none;
    }

    .refresh {
        background-color: var(--10blue);
        border: solid black 1px;
        border-radius: 5px;
        font-size: 20px;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        :hover {
            background-color: var(--lightPurple);
        }
    }

    .fileContainer {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
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

        :hover {
            transform: scale(1.4);
        }

        .srcImg {
            margin: auto;
            width: 80%;
            border-radius: 3px;
            cursor: pointer;

            :hover {
                transform: scale(2);
            }

            img {
                transition: ease-in-out 0.2s;
            }

            img:hover {
                transform: scale(1.4);
            }
        }

        .mediaFrame {
            background-color: white;
            margin: auto;
            width: 95%;
            border-radius: 5px;
            grid-column-start: 1;
            grid-column-end: 3;
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

const StarredFiles = () => {

        const [files, setFiles] = useState(null);

        const username = sessionStorage.getItem("postUsername")
        const data = {
            'username': username
        }

        if (!files) {
            axios.get(`http://localhost:3001/api/get/user/${username}`, data).then((response) => {
                setFiles(response)
            }).catch((e) => {
                toast.error('Failed to load files.');
            })
        }

        const download = (link, name, type) => {
            saveAs(link, `${name}.${type}`)
        }

      const del = (filename) => {
          const author = sessionStorage.getItem("postUsername")
          const data = {
              "author": author,
              "filename": filename.target.className
          }
        axios.post(`http://localhost:3001/api/delete/`, data, {headers: {'content-type': "application/json"}}).then((response) => {
          
        }).catch((e) => {
            toast.error('Failed to delete file.');
        })
      }

      const star = (filename) => {
        const file = (filename.target.className).slice(7);
        const data = {
            "author": username,
        }
      axios.post(`http://localhost:3001/api/star/${file}`, data, {headers: {'content-type': "application/json"}}).then((response) => {
          console.log(response)
      }).catch((e) => {
          toast.error('Failed to delete file.');
      })
    }

    return (
        <Wrapper>
            <div>
                <h1 className='title'>Starred Files</h1>
                {files && files.data ? files.data.map((file) => (
                    file.starByAuth ? 
                        <div key={file.filename} className="file">
                        {file.type.includes("image") ? <a className='srcImg' target={"blank"} href={`http://localhost/server/server${file.filename}`}><img width={"80%"} src={`http://localhost/server/server${file.filename}`} alt={`${file.filename}`}/></a> 
                        : "Media display available in files."}
                        <p>{file.filename.slice(20)}</p>
                        <FileSize size={file.size}>{file.size > 1000 ? 
                        file.size > 1000000 ? 
                        file.size > 10000000 ? 
                        (file.size / 100000000).toFixed(2) + "GB" : 
                        (file.size / 1000000).toFixed(2) + "MB" : 
                        (file.size / 1000).toFixed(2) + "KB" : 
                        file.size + "B"}</FileSize>
                        <div className='buttons'>
                            <button data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='delete' onClick={(v) => del(v)}><img className={`${file.filename}`} src='/trash.png' alt={`delete ${file.filename}`}/></button>
                            <button data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='download' onClick={() => download(`http://localhost/server/server${file.filename}`, file.filename.slice(20), file.type.split("/")[1])}><img src='/download.png' alt={`download ${file.filename}`}/></button>
                            <button data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='share'><a href={`/file/${(file.filename).slice(7)}`}><img className={`${file.filename}`} src="/share.png" alt={`share ${file.filename}`}/></a></button>
                            <button title='favorite' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='favorite' onClick={(v) => star(v)}><img className={`${file.filename}`} src={`${file.starByAuth === 1 ? "/starFilled.png" : "/starEmpty.png" }`} alt={`favourite ${file.filename}`}/></button>
                        </div>
                    </div>
                    : null))
                : null}
            </div>
            <div>

            </div>
        </Wrapper>
    )
}

export default StarredFiles;