'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

export default function Toast({ id, title, message, isError, isTimed, seconds }) {
    useEffect(() => {
        let toast = document.getElementById(id);
        let toastProgress = toast.querySelector(".toast-progress");
        
        setTimeout(() => {
            toast.classList.add('active');
            toastProgress?.classList.add('active');
        }, 100);
    }, []);

    function closeToast() {
        let toast = document.getElementById(id);
        let toastProgress = toast.querySelector(".toast-progress");

        toast.classList.remove('active');
        toastProgress?.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }

    return (
        <div id={id} className="toast" style={{ '--toast-status': isError ? "#d53d3d" : "#1a9988" }}>
            <div className="toast-content">
                <FontAwesomeIcon icon={faBell} className="bell"></FontAwesomeIcon>
                <div className="toast-message">
                    <span className="toast-title">{title}</span>
                    <span>{message}</span>
                </div>
            </div>
            <FontAwesomeIcon icon={faXmark} className="close" onClick={closeToast}></FontAwesomeIcon>
            {isTimed && <div className="toast-progress" style={{ '--toast-duration': seconds + "s" }} onAnimationEnd={closeToast}></div>}
        </div>
    );
}