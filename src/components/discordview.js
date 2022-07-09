import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

const Wrapper = styled.div`

    a, p, h1, h2, h3, h4, button, form, .resdata {
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
                transform: scale(1.3);
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
        
        #share:hover {
                background-color: var(--10purple);
                animation: shareHover 0.5s ease-in-out;
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
    }
`;

const DiscordView = () => {

    const [files, setFiles] = useState(null);
    const [fileStore, setFileStore] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [grid, setGrid] = useState(4);
    const [favoriteRes, setFavoriteRes] = useState('');
    const [showToast, setShowToast] = useState(false);

    const sizeArr = []
    const fileArr = []
    const id = []

    useEffect(() => {
        if (!fileStore) {
            return
        }
        if (!searchTerm || searchTerm === '') {
            setFiles(fileStore)
        }
        const fileSearch = []
            fileStore.data.map((file) => {
                const trim = file.filename.slice(20)
                if (trim.includes(`${searchTerm}`)) {
                    fileSearch.push(file)
                }
            })
        const data = {
            data: fileSearch
        }
        setFiles(data)
    }, [searchTerm, setSearchTerm])

    if (!files && !searchTerm) {
        axios.get(`http://localhost:3001/api/getview/discord`).then((response) => {
            setFiles(response)
            setFileStore(response)

        }).catch((e) => {
            setFavoriteRes('Failed to load files.');
            setShowToast(true)
        })
    }

    const download = (link, name, type) => {
        saveAs(link, `${name}.${type}`)
    }

    useEffect(() => {
        setTimeout(() => {
            setShowToast(false)
        }, 3000)
    }, [favoriteRes])

    return (
        <Wrapper grid={grid}>
            <div>
                <h1 className='title'>Discord Files</h1>
                {files && files.data ? files.data.map((file) => (
                    <div key={file.filename} className="file">
                        <a className='srcImg' target={"blank"} href={`${file.filename}`}><img width={"80%"} src={`${file.filename}`} alt={`${file.filename}`}/></a>
                        <p>{file.customname}</p>
                        <p>Uploaded: {file.date ? file.date.split("T")[0] : "Unknown"}</p>
                        <div className='buttons'>
                            <button title='download' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='download' onClick={() => download(`${file.filename}`, file.filename.slice(20), file.type.split("/")[1])}><img src='/download.png' alt={`download ${file.filename}`}/></button>
                            <button title='share' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='share'><a href={`/file/${(file.filename).slice(7)}`}><img className={`${file.filename}`} src="/share.png" alt={`share ${file.filename}`}/></a></button>
                        </div>
                        <div className='blur'>

                        </div>
                    </div>
                    ))
                : null}
            </div>
            <div>

            </div>
        </Wrapper>
    )
}

export default DiscordView;