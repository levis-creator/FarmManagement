import { atom } from "jotai";

// Atom to manage the form's open/close state
export const formIsOpen = atom(false);
// converts ordinary form add form into edit
export const editForm = atom(false)
// Atom to open the form
export const openForm = atom(
    null, // No read function, as this atom is only used for writing
    (get, set) => {
        set(formIsOpen, true); // Set the form state to open
    }
);

// Atom to close the form
export const closeForm = atom(
    null, // No read function, as this atom is only used for writing
    (get, set) => {
        set(formIsOpen, false); // Set the form state to closed
    }
);

// Atom to toggle the form's state
export const toggleForm = atom(
    null, // No read function, as this atom is only used for writing
    (get, set) => {
        const currentState = get(formIsOpen);
        set(formIsOpen, !currentState); // Toggle the state
    }
);