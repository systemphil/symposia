"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";


const VideoForm = () => {
    const [selectedFile, setSelectedFile] = useState<File>();

    // TODO query the database for existing video entry

    // TODO mutation of database entry

    // TODO handler that sets up the query for signedPostUrl and does the upload, and then upserts the db

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target && e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    // const onSubmit = (data) => {

    // }
    return(
        <div>
            <input
                onChange={(e) => handleFileChange(e)}
                type="file"
                accept="video/*"
            />

            {selectedFile && (
                <div>
                <p>Selected File: {selectedFile.name}</p>
                </div>
            )}
    </div>
    )
}

export default VideoForm;