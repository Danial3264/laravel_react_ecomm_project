import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../../config';

const Logo = () => {
    const [logos, setLogos] = useState([]);  // Initialize as an empty array
    const url = config.apiBaseUrl;
    const customUrl = config.customUrl;

    useEffect(() => {
        axios.get(`${url}/logos`)
            .then(response => {
                setLogos(response.data);  // Set the response data to logos
            })
            .catch(error => {
                console.error('Error fetching Logo:', error);
            });
    }, []);

    return (
        <>
            {logos.length > 0 ? (
                logos.map((log, index) => (
                    <img 
                        key={index} // Add a unique key for each child element
                        className='w-[200px] h-[50px]' 
                        src={`${customUrl}${log.logo}`}
                        alt="Logo"
                    />
                ))
            ) : (
                <p>No logos available</p>  // Handle case where no logos are available
            )}
        </>
    );
}

export default Logo;
