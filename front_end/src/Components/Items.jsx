import React from 'react';
import link from '../link.svg';
  
const Items = ({ currentItems }) => {
    const saveUrl = (url) => {
        // TODO add animation
        const input = document.createElement('textarea');
        input.innerHTML = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }

    return (
        <>
          {currentItems &&
            currentItems.map((item) => (
              <div className='paginator-line' key={item.name}>
                <h3>{item.name}</h3>
                <p onClick={_ => saveUrl(item.url)}><img src={link} alt={"NO ICON"} className='paginator-line-img'/></p>
                <p >{item.price.replace("&nbsp;", '\u00A0')}</p>
              </div>
            ))}
        </>
    );
  }
 
export default Items;