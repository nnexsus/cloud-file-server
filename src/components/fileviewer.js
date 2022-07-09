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

const FileSize = styled.p`
    color: ${prop => `rgba(${(prop.size / 10000000) * 5},${(255 - (prop.size / 10000000) * 5)},${(255 - (prop.size / 10000000) * 5)},1)`};
`;

const FileViewer = () => {

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

        const username = sessionStorage.getItem("postUsername")
        const data = {
            'username': username
        }
        if (!files && !searchTerm) {
            axios.get(`http://localhost:3001/api/get/user/${username}`, data).then((response) => {
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

      const del = (filename) => {
          const author = sessionStorage.getItem("postUsername")
          const data = {
              "author": author,
              "filename": filename.target.className
          }
        axios.post(`http://localhost:3001/api/delete/`, data, {headers: {'content-type': "application/json"}}).then((response) => {
            console.log(response)

        }).catch((e) => {
            setFavoriteRes('Failed to delete file.');
            setShowToast(true)
        })
      }

      const star = (filename) => {
          const file = (filename.target.className).slice(7);
          const data = {
              "author": username,
          }
        axios.post(`http://localhost:3001/api/star/${file}`, data, {headers: {'content-type': "application/json"}}).then((response) => {
            console.log(response)
            setFavoriteRes(response.data.message)
            setShowToast(true)
        }).catch((e) => {
            setFavoriteRes('Failed to favorite file.');
            setShowToast(true)
        })
      } 

      useEffect(() => {
        setTimeout(() => {
            setShowToast(false)
        }, 3000)
      }, [favoriteRes])

//<button className='share' onClick={(v) => copy(v)}><img className={`${flie.filename}`} src={``}></img></button>
    return (
        <Wrapper grid={grid}>
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
                        <div className='buttons'>
                            <button title='delete' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='delete' onClick={(v) => del(v)}><img className={`${file.filename}`} src='/trash.png' alt={`delete ${file.filename}`}/></button>
                            <button title='download' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='download' onClick={() => download(`http://localhost/server/server${file.filename}`, file.filename.slice(20), file.type.split("/")[1])}><img src='/download.png' alt={`download ${file.filename}`}/></button>
                            <button title='share' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='share'><a href={`/file/${(file.filename).slice(7)}`}><img className={`${file.filename}`} src="/share.png" alt={`share ${file.filename}`}/></a></button>
                            <button title='favorite' data-augmented-ui="tl-clip br-clip inlay" className='gridButtons' id='favorite' onClick={(v) => star(v)}><img className={`${file.filename}`} src={`${file.starByAuth === 1 ? "/starFilled.png" : "/starEmpty.png" }`} alt={`favourite ${file.filename}`}/></button>
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

export default FileViewer;