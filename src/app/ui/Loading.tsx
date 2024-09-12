import React, {useEffect} from 'react';
import {CircleLoader} from "react-spinners";


const Loading: React.FC = () => {

    const [message, setMessage] = React.useState<string | null>(null)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setMessage("La connexion est trop lente, veuillez réessayer plus tard.")
        }, 5000)
        return () => clearTimeout(timeout)
    }, []);


    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p>Chargement...</p>
            <CircleLoader color={'#000000'} loading={true} size={50}/>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Loading;