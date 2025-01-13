import React from 'react';
import { useNavigate } from 'react-router-dom';

function Button({
    navigateTo = "#",
    text = "Button",
    image,
    class_Name = '',
    onClick,
}) {
    const navigate = useNavigate();

    return (
        <button
            type="submit"
            className={`flex w-full justify-center rounded-md px-3  py-1.5 text-sm/6 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-offset-2 ${class_Name || "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}

                onClick={onClick}
        >
            {image && (
                <img
                    src={image}
                    alt={text}
                    className="w-6 mx-2"
                />
            )}
            {text}
        </button>
    );
}

export default Button;
