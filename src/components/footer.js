import styled from 'styled-components';

const Wrapper = styled.div`

    margin: 0 70px 0 70px;
    filter: drop-shadow(0px 0px 10px black);
    margin-top: 60px;

    .footer {
        display: grid;
        grid-template-columns: repeat(2,50%);
        background-color: var(--grayBlue);
        padding: 0 30px 10px 30px;
        
        --aug-border-bg: var(--10blue);
        --aug-border-all: 9px;
        --aug-inlay-bg: var(--10purple);
        --aug-inlay-all: 10px;
        --aug-br-extend2: 300px;
        --aug-t-extend1: 400px;
        --aug-r-extend1: 190px;


    .social, .about, .linkContainer, .other {
        font-family: "Comp";
    }

    h1 {
        color: var(--whiteBlue);
    }

    p, li{
        color: var(--white)
    }

    li {
        list-style-type: none;
        margin-bottom: 8px;
        margin-left: -30px;
        text-indent: 15px;
    }

    .linkContainer {
        text-align: right;
        padding-right: 5px;
    }

    .links {
        display: grid;
        grid-template-columns: repeat(3, 33%);
        a {
            background-color: var(--lightPurple);
            margin: 3px;
            border: solid 2px var(--60);
            border-radius: 10px;
            padding-right: 5px;
            transition: 0.2s ease-in-out;
            text-decoration: none;

            :hover {
                background-color: var(--10blue);
            }
        }
        .gridSpacer {
            grid-column: 1;
            grid-row-start: 1;
            grid-row-end: 4;
        }
    }

    .social {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row: 3;
        display: flex;
        margin-left: -10px;

        img {
            width: 40px;
            height: 40px;
            background-color: var(--lightPurple);
            padding: 0px;
            border: solid 2px black;
            border-radius: 50%;
            margin: 15px 10px 0 10px;
            box-shadow: 0px 0px 0px 3px white;
            transition: 0.4s ease-in-out;

            :hover {
                background-color: var(--10blue);
                box-shadow: 0px 0px 0px 8px white;
                padding: 5px;
            }
        }
    }

    .other {
        grid-column-start: 2;
        grid-column-end: 3;
        grid-row: 3;
        display: flex;
        align-items: center;
        text-align: center;
        margin: 3px -20px 15px 70px;

        a {
            background-color: var(--lightPurple);
            margin: 10px;
            padding: 3px;
            color: var(--10blue);
            border: solid 2px black;
            border-radius: 10px;
            transition: 0.4s ease-in-out;

            :hover {
                background-color: var(--10blue);
            }
        }

        p {
            font-size: 12px;
        }
    }

    }

    @media screen and (max-width: 860px) {
        margin: 0 1% 0 1%;
        .footer {
            --aug-t-extend1: 30%;
        }
    }

    @media screen and (max-width: 675px) {
        margin: 0 1% 0 1%;
        .footer {
            --aug-t-extend1: 30%;
            .other {
                grid-column-start: 1;
                grid-column-end: 3;
                grid-row: 4;
                margin: 5px -20px 15px 3px;
            }
        }
    }
`;

const Footer = () => {

    return (
        <Wrapper>
            <div data-augmented-ui="tl-clip t-clip-x r-clip-y br-2-clip-x bl-clip both" className='footer'>
                <div className='about'>
                    <h1>About</h1>
                    <ul>
                        <li>The nnexsus cloud server (nn-cloud-server) is a simple file hosting cloud server for all filetypes.</li>
                        <li>Google drive spends hours uploading, apps like Mega have daily download limits.</li>
                        <li>The only limits on this server is a 50Gb cumulative filesize limit.</li>
                        <li>Other than that, it purely exists to star the crap that slows down your drives.</li>
                    </ul>
                </div>
                <div className='linkContainer'>
                    <h1>Links</h1>
                        <div className='links'>
                            <div className='gridSpacer'>
                                <p></p>
                            </div>
                        <a href='/home'><p>Home</p></a>
                        <a href='/about'><p>About</p></a>
                        <a href='/account'><p>Account</p></a>
                        <a href='/files'><p>Files</p></a>
                        <a href='/discordfiles'><p>Discord Files</p></a>
                    </div>
                </div>
                <hr style={{width: "100%"}}></hr>
                <div className='social'>
                    <a href='https://twitter.com/_nnexsus' target="blank"><img src='/Twitter-Logo-circle.png' alt='twitter link'/></a>
                    <a href='https://youtube.com/c/nnexsus' target="blank"><img src='/Youtube-Logo-circle.png' alt='youtube link'/></a>
                    <a href='https://github.com/nnexsus' target="blank"><img src='/Github-Logo.png' alt='github link'/></a>
                    <a href='https://discord.gg/d8R2tDaBK2' target="blank"><img src='/Discord-Logo.png' alt='discord invite link'/></a>
                    <a href='https://nnexsus.net' target="blank"><img src='/nnlogogifcrop.gif' alt='my homepage link'/></a>
                </div>
                <div className='other'>
                    <a href='mailto:nnexsus.service@gmail.com'><p>nnexsus.service@gmail.com</p></a>
                    <a href="/tos"><p>Terms of Service</p></a>
                </div>
            </div>
        </Wrapper>
    )
}

export default Footer;