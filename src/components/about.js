import styled from 'styled-components';

const Wrapper = styled.div`

    margin: 0 auto;
    padding: 10px;
    border: solid var(--10blue) 2px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.8);
    text-align: center;
    max-width: 90%;
    margin-top: 60px;
    transform: translate(0px, -25px);

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1, h2, h3, h4, p {
        font-family: "Comp";
    }

    .about {
        padding: 8px;
        background-color: var(--grayBlue);
        border-radius: 10px;
        width: 80%;
        border: solid 2px var(--10blue);
        transition: 0.3s ease-in-out;

        .aboutTitle {
            background-color: var(--whiteBlue);
            border-radius: 15px;
        }

        :hover {
            transform: scale(1.05);
            background-color: var(--10purple);
        }
    }

    .contactContainer {
        margin-top: 40px;
        padding: 15px;
        background-color: var(--60);
        border-radius: 10px;
        border: var(--10blue) solid 2px;
        box-shadow: 0px 0px 5px 5px black inset;

        transition: 0.3s ease-in-out;

        :hover {
            transform: scale(0.95);

            .links{
                transform: scale(1.12);
            }
        }
    }

    .links {
        display: grid;
        grid-template-columns: repeat(2, 50%);
        background-size: 7px;
        background-color: black;
        background-position: center;
        --aug-border-bg: var(--10blue);
        --aug-border-all: 2px;
        transition: 0.3s ease-in-out;
    }

    a {
        text-decoration: none;
        color: var(--whiteBlue);
        margin: 5px;
    }

    .mediaLink {
        margin: 10px;
        padding: 5px 75px 5px 75px;
        border: black solid 2px;
        border-radius: 5px;
        background-color: var(--10purple);
        box-shadow: 0px 0px 4px 3px rgba(50, 50, 50, 1);
        height: 100%;
        text-shadow: 0px 0px 4px black;

        transition: 0.2s ease-in-out;

        :hover {
            box-shadow: 0px 0px 8px 6px aliceblue;
            transform: scale(1.1);
            color: white;

            Img {
                transition: 0.2s ease-in-out;
                filter: drop-shadow(0px 0px 10px white);
            }
        }
    }

    .daPlug {
        margin-top: 40px;
        width: 70%;
        color: white;
    }

    @media screen and (max-width: 420px) {
        .links {
            grid-template-columns: repeat(1, 100%)
        }
    }

`;

const Img = styled.img`

    width: 75px;
    filter: drop-shadow(0px 0px 10px black);
    transition: 0.2s ease-in-out;

`;

const About = () => {

    return (

        <Wrapper>
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/augmented-ui@2/augmented-ui.min.css"></link>
            <div className='container'>
                <div className='about'>
                    <h1 className='aboutTitle'>About</h1>
                    <h2 style={{color: "white"}}>Story behind the server:</h2>
                    <h3 style={{color: "white"}}>This app was developed due to my increasing need for space on my computer. As I filled up my 3rd terabtye I found the speed of my pc falling fast, and thus the server was put into plan.</h3>
                    <h2 style={{color: "white"}}>Details:</h2>
                    <p style={{color: "white"}}>This app uses a personal secured server that is kept up to date. All files are secured on client & server-side. All information is encrypted and secured. Files are size preserved.</p>
                </div>
                <div className='contactContainer'>
                    <h1 className='contactTitle' style={{color: "white"}}>Links & Contacts</h1>
                        <div data-augmented-ui="tl-clip-inset t-clip-xy tr-clip-inset r-clip-xy br-clip-inset b-clip-xy bl-clip-inset l-clip-xy both" className='links'>
                            <a target="blank" href="https://twitter.com/_nnexsus"> <div className='mediaLink'> <h2>Twitter</h2>  <Img src="/Twitter-Logo.png"></Img> </div> </a>
                            <a target="blank" href="https://youtube.com/c/nnexsus"> <div className='mediaLink'> <h2>Youtube</h2>  <Img src="/Youtube-Logo.png"></Img> </div> </a>
                            <a target="blank" href="https://discord.gg/d8R2tDaBK2"> <div className='mediaLink'> <h2>Discord</h2>  <Img src="/Discord-Logo.png"></Img> </div> </a>
                            <a target="blank" href="https://github.com/nnexsus"> <div className='mediaLink'> <h2>Github</h2> <Img src="/Github-Logo.png"></Img>  </div> </a>
                        </div>
                </div>
                <div className='daPlug'>
                    <h1>Check out my (main site) portfolio!</h1>
                    <h4>If you'd like a website like this one built, you can find my contacts through here or the footer!</h4>
                    <a target="_blank" href="https://nnexsus.net"> <div className='mediaLink'> <h2>nnexsus.net</h2> <img style={{width: "60%"}} src="/solarbg.png"></img>  </div> </a>
                </div>
            </div>
        </Wrapper>

    )

}

export default About;