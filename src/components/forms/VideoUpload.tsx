"use client";


export default function VideoUpload() {
    const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const filename = encodeURIComponent(file.name);
        const res = await fetch(`/api/upload-video?file=${filename}`);

        if (!res.ok) {
            console.error('API request failed.');
            return;
        }
        
        const { url, fields } = await res.json();
        const formData = new FormData();
    
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
            if (typeof value === "string") {
                formData.append(key, value);
            } else if (value instanceof Blob) {
                formData.append(key, value, file.name)
            }
        });
    
        const upload = await fetch(url, {
            method: 'POST',
            body: formData,
        });
    
        if (upload.ok) {
            console.log('Uploaded successfully!');
        } else {
            console.error('Upload failed.');
        }
    };
    
    return (
        <div className="bg-green-500">
            <p>Upload video.</p>
            <input
                onChange={uploadVideo}
                type="file"
                accept="video/*"
            />
        </div>
    );
}