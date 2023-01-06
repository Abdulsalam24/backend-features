import React from 'react'

const FileUploader = ({profileImage , onChange}) => {
    return (
        <div className='file-upload'>
            <img src={profileImage.name ? URL.createObjectURL(profileImage) : profileImage} alt="" />
            <h1>File Upload</h1>
            <input type="file" filename="profileImage" className="custom-file-input" name="profileImage" onChange={onChange} />
        </div>
    )
}

export default FileUploader