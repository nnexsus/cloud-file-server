import styled from 'styled-components'
import RecentFiles from './recentfiles';
import StarredFiles from './starredfiles';
import DiscordView from './discordview';

const Wrapper = styled.div`

    p, h1, h2, h3, h4, h5, a {
        font-family: "Comp";
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

    .main {
        margin: 20px 5% 20px 5%;
        margin-top: 40px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        background-color: var(--grayBlue);
        border-radius: 5px;
        border: solid 2px black;
    }

    .recent, .starred, .discord {
        background-color: var(--baseColor);
        padding: 10px;
        margin: 10px;
        border: solid var(--10blue) 2px;
        border-radius: 10px;
        box-shadow: 0px 0px 6px 3px black;
        transition: 0.5s ease-in-out;

        :hover {
            box-shadow: 0px 0px 12px 3px black;
        }
    }

    .recent {
        grid-row-start: 2;
        grid-column-start: 2;
    }

    .welcome {
        text-align: center;
        color: var(--white);
        grid-row-start: 1;
        grid-column-start: 1;
        grid-column-end: 4;
        padding: 10px;
        background-color: var(--10purple);
    }

    @media screen and (max-width: 675px) {
        .main {
            display: flex;
            flex-direction: column;
            margin: 3px;

            img {
                width: 60%;
            }
        }
    }

`;

const Home = () => {

    return (
        <Wrapper>
            {sessionStorage.getItem('postUsername') ? 
                <div className='main'>
                    <h1 className='welcome'>Welcome back {(sessionStorage.getItem('username')).split(".")[0]}.</h1>
                    <div className='recent'>
                        <RecentFiles></RecentFiles>
                    </div>
                    <div className='starred'>
                        <StarredFiles></StarredFiles>
                    </div>
                    <div className='discord'>
                        <DiscordView></DiscordView>
                    </div>
                </div>
            : 
                <div className='signin'>
                    <div>
                        <p className='signintext'>Sign in or sign up to upload and view your files.</p>
                        <a href='/signin'>Sign In</a>
                        <a href='/signup'>Sign Up</a>
                    </div>
                </div>
            }
        </Wrapper>
    )
}

export default Home;