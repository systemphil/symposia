"use client";

import { apiClientside } from '@/lib/trpc/trpcClientside';
import { type ModelName } from '@/server/controllers/coursesController';
import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';


// deleteEntry: (id: string) => void;
const DeleteContext = createContext({deleteEntry: (id: string, modelName: ModelName) => null});

/**
 * Custom Hook to call tRPC to delete an entry from db. 
 * @method .deleteEntry Use method to execute call. Requires the model name and entry ID.
 * @access ADMIN
 */
export const useDeleteEntry = () => {
    return useContext(DeleteContext);
};

export const DeleteEntryProvider = ({ children }: { children: React.ReactNode}) => {
    const [ deleteStaging, setDeleteStaging ] = useState<{id: string, modelName: ModelName} | null>(null);
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
    /**
     * deleteEntry will first store the arguments to state and then open a modal window to await confirmation from user.
     */
    const deleteEntry = (id: string, modelName: ModelName) => {
        /**
         * Closes the modal when the user clicks outside of the element dimensions. Must be initiated by an event listener.
         */
        const exitModalByOutsideClick = (e: MouseEvent, modalElement: HTMLDialogElement) => {
            const dialogDimensions = modalElement.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modalElement.close();
                modalElement.removeEventListener("click", e => exitModalByOutsideClick(e, modalElement));
                setDeleteStaging(null);
            }
        };
        /**
         * Instead of generating discrete dialogs based on input, we store the input into state and keep only a single dialog
         * that has access to the delete execution. 
         */
        setDeleteStaging({ id, modelName});
        const modalElement = document.getElementById(`modal_confirm_delete_entry`) as HTMLDialogElement;            
        if (modalElement) {
            modalElement.showModal();
            modalElement.addEventListener("click", e => exitModalByOutsideClick(e, modalElement));
        }

        return null;
    };
    /**
     * Handler for closing the modal by button click.
     */
    const handleCloseModal = (name: string) => {
        const modalElement = document.getElementById(`${name}`) as HTMLDialogElement;
        if (modalElement) {
            modalElement.close();
            setDeleteStaging(null);
        }
    };
    const executeDeletion = () => {
        if (deleteStaging === null) return;
        mutation.mutate(deleteStaging);
        handleCloseModal("modal_confirm_delete_entry");
    }

    return (
        <DeleteContext.Provider value={{ deleteEntry }}>
            {children}

            <dialog id="modal_confirm_delete_entry" className="bg-gray-200 p-8 rounded-lg backdrop:bg-slate-600/[.5] outline-dotted outline-red-600">
                <h3 className="font-bold text-lg text-center">Are you sure you want to delete this?</h3>
                <p className="py-4 max-w-md">
                    <span className="text-red-600 font-bold">WARNING!</span> This action cannot be undone and will erase information entirely from the database.
                </p>
                <div className="flex gap-8 justify-between">
                    <button
                        type="button"
                        className="btn btn-primary hover:bg-red-500"
                        onClick={() => executeDeletion()}
                        >
                        Confirm Deletion
                    </button>
                    <button 
                        className="btn btn-secondary"
                        type="button" 
                        onClick={() => handleCloseModal("modal_confirm_delete_entry")}
                        >
                        Close
                    </button>
                </div>
            </dialog>
        </DeleteContext.Provider>
    );
}
