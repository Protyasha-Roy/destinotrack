import React from 'react';
import DefaultHome from '../../components/DefaultHome/DefaultHome';
import HomeDash from '../../components/HomeDash/HomeDash';

const Home = () => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    return(
        <>
            {
                userLoggedIn ? <HomeDash /> : <DefaultHome />
            }
        </>
    )
}

export default Home;
