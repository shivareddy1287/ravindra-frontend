import React from "react"
import "./404error.css"

import errorPage from "../../Assets/svgs/error1.svg"

const Error404 = () => {
  return (
    <div className="error-page-cont">
      <img src={errorPage} alt="Error Page" />
      <span>Page Not Found</span>
    </div>
  )
}

export default Error404
