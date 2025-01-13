import React from 'react'

function ThirdCard({
    imgsrc,
    title
}) {
    return (

        <div className=" bg-white border w-[150px] h-[200px] border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 p-2 transition-transform transform hover:scale-105">
            <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={imgsrc} alt="IMG" />
            <div className="flex flex-col justify-between text-center ">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{title}</h5>
            </div>
        </div>

    )
}

export default ThirdCard