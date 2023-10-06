"use client";

import { apiClientside } from '@/lib/trpc/trpcClientside';
import { type ModelName } from '@/server/controllers/coursesController';
import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';


// deleteEntry: (id: string) => void;
const DeleteContext = createContext({deleteEntry: (id: string, modelName: ModelName) => null});

export const useDeleteEntry = () => {
    return useContext(DeleteContext);
};

export const DeleteEntryProvider = ({ children }: { children: React.ReactNode}) => {
    const utils = apiClientside.useContext();
    const mutation = apiClientside.courses.deleteModelEntry.useMutation({
        onSuccess: (entry) => {
            void utils.courses.invalidate();
            toast.success(`Success! ${entry.id} deleted.`)
        },
        onError: (error) => {
            toast.error(`Oops! Something went wrong. ${error.message}`)
        }
    });

    const deleteEntry = (id: string, modelName: ModelName) => {
        mutation.mutate({ id, modelName });
        return null;
    };

    return (
        <DeleteContext.Provider value={{ deleteEntry }}>
            {children}
        </DeleteContext.Provider>
    );
}
