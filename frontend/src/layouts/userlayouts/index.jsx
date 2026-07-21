import React from 'react'
import NavBarComponent from "../../Components/Navbar";
import styles from "./styles.module.css";
 function Userlayouts({children}) {
  return (
    <div>
        <NavBarComponent/>
      {children}
    </div>
  )
}

export default Userlayouts;