"use client";


export default function VideoUpload() {
    const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        // 1 encode
        const filename = encodeURIComponent(file.name);
        // 2 get signedPostUrl to gc -- use tRPC here
        const res = await fetch(`/api/upload-video?file=${filename}`);

        if (!res.ok) {
            console.error('API request failed.');
            return;
        }
        
        const { url, fields } = await res.json();

        // 3 build FormData
        const formData = new FormData();
    
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
            if (typeof value === "string") {
                formData.append(key, value);
            } else if (value instanceof Blob) {
                formData.append(key, value, file.name);
            }
        });
        
        // 4 External post to gc
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
        <div className="bg-green-500 p-6 rounded-md">
            <p>Upload video.</p>
            <input
                onChange={uploadVideo}
                type="file"
                accept="video/*"
            />
        </div>
    );
}