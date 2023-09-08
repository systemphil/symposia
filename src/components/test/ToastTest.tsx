"use client";

import toast from 'react-hot-toast';

const ToastTest = () => {
    const notify = () => toast.success('Here is your toast.');

    return (
        <button className="btn btn-error" onClick={notify}>Make me a toast!</button>
    )
}

export default ToastTest;