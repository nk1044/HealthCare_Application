import React from 'react'

function MedCard({
    id,
    title,
    description,
    image_url
}) {
  return (
      <div className="w-[25vw] min-w-52 rounded overflow-hidden shadow-lg border transition-transform transform hover:scale-105">
          <div className='flex justify-center mt-1'>
          <img 
            className="w-48 " 
            src={image_url} 
            alt="medcard" />
          </div>
            
              <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{title ?? "Medical Card"}</div>
                  <p className="text-gray-700 text-base">
                      {description ?? "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil."}
                  </p>
              </div>
      </div>
  )
}

export default MedCard