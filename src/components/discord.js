import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

const Wrapper = styled.div`

    background-color: var(--darkpurple);
    margin: 15px;
    border: solid black 2px;
    border-radius: 5px;
    padding: 15px;
    margin-top: 50px;

    .hidden {
        display: none;
    }

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

    .invite {

        border: solid black 2px;
        border-radius: 10px;
        background-color: var(--10purple);

        h4 {
            border: solid black 2px;
            border-radius: 10px;
            background-color: var(--lightPurple);
            transition: 0.2s ease-in-out;
            width: fit-content;
            margin: 10px auto 5px auto;
            padding: 10px;
        }

        h1, h2, h3, h4 {
            text-align: center;
            color: white;
            font-family: "Comp";
            font-kerning: 10px;
        }

        h4:hover {
            background-color: var(--10blue);
        }
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

    .searchbar {
        background-color: var(--lightPurple);
        padding: 5px;
        margin: 10px;
        border: black solid 1px;
        border-radius: 5px;
        transition: 0.3s ease-in-out;
        font-family: "Comp";

        :hover {
            background-color: var(--10blue);
        }
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

        :hover {
            transform: scale(1.4);
        }

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

            :hover {
                transform: scale(2);
            }

            img {
                transition: ease-in-out 0.2s;
            }

            img:hover {
                transform: scale(2);
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

const Discord = () => {

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
        axios.get(`http://localhost:3001/api/getall/discord`).then((response) => {
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
            <div className='invite'>
                <h2 style={{color: "white", fontFamily: "Comp"}}>Saved files from Tether Bot!</h2>
                <h3 style={{color: "white", fontFamily: "Comp"}}>If you want Tether Bot in your server, you can invite it here: </h3>
                <a href='https://discord.com/api/oauth2/authorize?client_id=898770846657675305&permissions=8&scope=bot'><h4>Tether</h4></a>
            </div>
            <button className='refresh' onClick={() => setFiles(!files)}>Reload Files</button>
            <input className='searchbar' id='search' type={"text"} placeholder="Search for files." value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)}/>
            <label htmlFor='search' style={{color: "white", fontFamily: "Comp"}}>Search for filename or extension.</label>
            <label htmlFor='rowSelect' style={{color: "white", fontFamily: "Comp", marginLeft: "30px"}}>Display in row:</label>
            <select id='rowSelect' className='searchbar' name='Row' value={grid} onChange={(e) => setGrid(e.currentTarget.value)}>
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"4"}>4</option>
                <option value={"5"}>5</option>
                <option value={"6"}>6</option>
                <option value={"7"}>7</option>
                <option value={"8"}>8</option>
                <option value={"9"}>9</option>
                <option value={"10"}>10</option>
            </select>
            {showToast ?
            <div className='toasts' data-augmented-ui="tl-2-clip-x tr-2-clip-y br-clip bl-clip both">
                <p style={{color: "white", textAlign: "center"}}>{favoriteRes}</p>
            </div>
            : null}
            <div className='fileContainer'>
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

export default Discord;