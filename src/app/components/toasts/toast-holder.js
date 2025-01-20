'use client'
import { createContext, useContext, useState } from "react"
import Toast from "./toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (title, message, isError, isTimed, seconds) => {
        //Remove old toasts if past max
        let toastHolder = document.getElementById('toast-holder');
        const currToastArr = Array.from(toastHolder.children);
        const maxToasts = window.innerWidth <= 600 ? 2 : 4;
        if (currToastArr.length > maxToasts) {
            for (let i = maxToasts; i < currToastArr.length; i++) {
                let toastProgress = currToastArr[i].querySelector(".toast-progress");
                currToastArr[i].classList.remove('active');
                toastProgress?.classList.remove('active');
                setTimeout(() => {
                    currToastArr[i].remove();
                }, 500);
            }
        }

        //Add new toast
        const id = Date.now();
        setToasts((prev) => [...prev, { id, title, message, isError, isTimed, seconds }]);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div id="toast-holder">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);