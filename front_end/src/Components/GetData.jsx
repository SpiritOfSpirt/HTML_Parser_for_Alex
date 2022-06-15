import React, { useState } from 'react';
import axios from 'axios';

import Paginator from './Paginator';
import { SERVR_URL } from "../index";
  
const GetData = () => {
    const [findByName, setFindByName] = useState("");
    const [error, setError] = useState("");
    const [data, setData] = useState([]);

    const getData = async () => {
        setError("");

        try {
            const ans = await axios.get(SERVR_URL + "/" + findByName);

            if (ans.status === 200) setData(ans.data);
        } catch(err) {
            setError(err.message);
        }
    }

    const changeName = (e) => {
        setError("");
        setFindByName(e.target.value);
    }

    // TODO write validation for fields and make red border of textarea and disable button send
    // also disable button while flying request

    return (
        <div className='Read-block'>
            <textarea placeholder='name' onChange={changeName}/>
            <button onClick={getData}>
                Get Data
            </button>
            {error}
            <Paginator data={data}/>
        </div>
    );
  }
 
export default GetData;