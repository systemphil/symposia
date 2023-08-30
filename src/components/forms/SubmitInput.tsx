"use client";

import clsx from 'clsx'

type Props = {
    value: string;
    isLoading: boolean;
}

const SubmitInput = ({ value, isLoading }: Props) => {
    const classes = clsx({
        'btn btn-primary': true,
        '': !isLoading,
        'btn-disabled': isLoading,
    });

    const label = isLoading ? 'Loading...' : value;

    return (
        <div>
            <input className={classes} type="submit" value={label} disabled={isLoading} />
        </div>
    )
}

export default SubmitInput;