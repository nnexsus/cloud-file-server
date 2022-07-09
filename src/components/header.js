import styled from "styled-components";
import { useState, useEffect } from 'react';

const Wrapper = styled.div`

    p, h1, h2, h3, h4, div {
        font-family: "Comp";
    }

    .header {
        z-index: 10;

        margin-bottom: -35px;
        display: flex;
        padding: 13px;
        padding-left: 30px;
        padding-right: 30px;
        align-items: center;
        --aug-inlay-bg: var(--purple);
        --aug-t-center: 70%;
        --aug-b-center: 70%;
        --aug-t-extend1: 10px;
        --aug-b-inset1: -10px;
        --aug-bl-extend1: 440px;
        --aug-border-bg: var(--60);
    }

    .links {
        display: flex;
        margin-left: -10px;
        width: 100%;
        text-align: center;
        margin-top: -10px;

        a {
            margin-right: 10%;
        }
    }

    .acc {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: 0px;
    }

    .pfp {
        width: 24px;
        padding: 6px;
    }

    .folder {
        width: 34px;
        padding: 2px;
    }

    .pfp, .home, .folder, .logo {
        cursor: pointer;
        transition: ease-in-out 0.1s;
        border-radius: 5px;
        background-color: var(--60);

        :hover {
            background-color: var(--10blue);
        }
    }
    
    .home {
        width: 25px;
        padding: 2px;
    }

    .dropdown {
        position: absolute;
        display: flex;
        align-items: center;
        top: 7px;
        right: 70px;
        transition: ease-in-out 0.3s;
        background-color: rgba(0,0,0,0.6);
        border-radius: 10px;
        padding: 0 5px 0 5px;
        
        p, a {
            color: white;
            text-decoration: underline;
            margin-right: 5px;
        }
    }

    .logo {
        width: 21px;
        margin-right: 30px;
        padding: 5px;
        border-radius: 5px;
        background-color: rgba(0,0,0,0.6);
    }

    @media screen and (max-width: 720px) {
        .header {
            --aug-b-inset1: -15px;
        }
    }

    @media screen and (max-width: 620px) {
        .header {
            --aug-b-inset1: -15px;
            --aug-bl-extend1: 50%;
        }
    }

    @media screen and (max-width: 490px) {
        .header {
            --aug-b-inset1: -15px;
            --aug-bl-extend1: 50%;
            --aug-t-center: 50%;
        }
    }
`;

const Header = () => {

    const [accDrop, setAccDrop] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (accDrop) {
                setAccDrop(!accDrop)
            }
        }, 3000)
        return () => clearTimeout(timer);
    }, [accDrop])

    return (
        <Wrapper>
            <div data-augmented-ui="tl-clip t-clip-x br-rect-y b-rect-y bl-2-clip-x both" className="header">
                    <div className="links">
                        <a href="/home"><img src="/home.png" className="home" alt={"home"}/></a>
                        <a href="/files"><img src="/folder.png" className="folder" alt={"files"}/></a>
                        <a href="/discord"><img src="/folderdiscord.png" className="folder" alt={"discord files"}/></a>
                    </div>
                    <div>
                        <a href="/about"><img src="/logo.png" className="logo"/></a>
                    </div>
                    <div className="acc" onClick={() => setAccDrop(!accDrop)}>
                        <img src="/basic.png" className="pfp" alt={"account"}/>
                        {accDrop ? 
                        <div className="dropdown">
                            <a href="/account"><p>{sessionStorage.getItem("postUsername") ? (sessionStorage.getItem("username")) : null}</p></a>
                            {sessionStorage.getItem("postUsername") ? <a href="/signout">Signout</a> : <a href="/signin">Sign in</a>}
                        </div>
                        : null}
                    </div>
            </div>
        </Wrapper>
    )
}

export default Header;