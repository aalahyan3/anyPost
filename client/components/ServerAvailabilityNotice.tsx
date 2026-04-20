import axios from 'axios'
import React from 'react'

async function ServerAvailabilityNotice() {

  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/health`);

  if (res.status !== 200) {
    return (
      <div className='bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg p-4 mt-2 mb-6 text-center text-sm'>
        The server is not available for the moment. I'm so sorry about that
      </div>
    )
  }

  return null;


}

export default ServerAvailabilityNotice