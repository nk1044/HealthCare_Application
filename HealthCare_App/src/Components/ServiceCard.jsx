import React from 'react'

function ServiceCard({
    imgsrc,
    title,
    description
}) {
    return (
        <div className="bg-gray-100 max-w-72 max-h-64 rounded-lg shadow-lg p-6 text-center
        transform transition-all hover:scale-105 hover:shadow-2xl">
            <img
                src={imgsrc}
                alt="Pharmacy"
                className="w-20 h-20 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800">{title || "Pharmacy"}</h3>
            <p className="text-gray-600 mt-2">
                {description || "Order medicines online and get them delivered to your doorstep."}
            </p>
        </div>
    )
}

export default ServiceCard