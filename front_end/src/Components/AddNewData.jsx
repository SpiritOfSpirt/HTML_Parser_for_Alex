import React, { useState } from 'react';
import axios from 'axios';

import { SERVR_URL } from "../index";
  
const AddNewData = () => {
    const [typeOfSelector, setTypeSelector] = useState("CSS");
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [selector, setSelector] = useState("");
    const [error, setError] = useState("");

    let isCSS = typeOfSelector === "CSS";

    const sendData = () => {
        setError("");
        const req = { url, name };
        if (isCSS) req.className = selector;
        else req.elementId = selector;

        axios.post(SERVR_URL + "/data", req).catch(err => {
            console.log("MY LOG", err);
            setError(err.message);
        });
    }

    const changeTypeOfSelector = (e) => {
        setError("");
        setTypeSelector(prevState => prevState === "CSS" ? "ID" : "CSS");
    }

    const changeName = (e) => {
        setError("");
        setName(e.target.value);
    }

    const changeUrl = (e) => {
        setError("");
        setUrl(e.target.value);
    }

    const changeSelector = (e) => {
        setError("");
        setSelector(e.target.value);
    }

    // TODO write validation for fields and make red border of textarea and disable button send
    // also disable button while flying request

    return (
        <div className='Create-block'>
            <textarea placeholder='name' onChange={changeName}/>
            <textarea placeholder='url' onChange={changeUrl} />
            <textarea placeholder={isCSS ? "write className" : "write html element Id"} onChange={changeSelector}/>
            <button onClick={changeTypeOfSelector}>
                {
                    isCSS
                        ? "Switch to html element Id"
                        : "Switch to CSS className"
                }
            </button>
            <button onClick = {sendData}>
                Send Data
            </button>
            {error}
        </div>
    );
  }
 
export default AddNewData;