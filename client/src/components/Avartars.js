import axios from 'axios'
import { avatars } from 'pages/RegisterPage'
import React from 'react'

const Avartars = ({ profileImage, handleSelect}) => {

    return (
        <div className="flex">
            <h3>Choose your Avatar</h3>
            <div className='avatars'>
                {
                    avatars.map((avatar, index) => (
                        <div className={`${profileImage === avatar && 'selected'}`} key={index} onClick={() => handleSelect(index)}>
                            <img src={avatar} alt="avatar" />
                        </div>
                    ))
                }
            </div>         
        </div>

    )
}

export default Avartars