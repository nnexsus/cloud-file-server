import { useEffect } from "react";

const { useNavigate } = require("react-router");

const Signout = () => {

    const navigate = useNavigate()

    sessionStorage.clear();

    useEffect(() => {
        navigate("/")
    }, [])
    
    return (
        <div style={{color: "var(--10purple)", fontFamily: "Comp", marginTop: "50px"}}>
            Signed Out
        </div>
    )
}

export default Signout;