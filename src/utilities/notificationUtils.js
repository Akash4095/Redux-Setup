import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Notification = ({ id, notifySelector, type, notifyDoneAction }, props) => {
    const notifyObj = useSelector(state => notifySelector(state, id))
    const dispatch = useDispatch()
    useEffect(()=>{
        if(id !== 0 && notifyObj){
            const options = {
                position: "top-right",
                autoClose: 1200,
                hideProgressBar: true
            }
            const getNotObj = type === "save" ? notifyObj.save : type === "edit" ? notifyObj.edit : type === "delete" ? notifyObj.delete : {}
            if(getNotObj){
                toast[getNotObj.status]( getNotObj.msg, options );
                dispatch(notifyDoneAction({id, type}))
            }
        }
    })
    if (notifyObj){
    return (
        <ToastContainer />
    )} else return null
}

export default Notification;