import React, { useEffect, useState } from 'react'
import { Send } from "@mui/icons-material"
import "./App.css"
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleSendMessage = () => {
    // Ensure the message is not empty or contains only whitespace
    if (message.trim() !== '') {
      // Send the message to the server
      socket.emit('message', message);

      // Update the chat with the user's message
      setChat((prevChat) => [...prevChat, { text: message, type: 'user' }]);

      // Clear the input field
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('response', (response) => {
      // Ensure the response is not empty
      if (response[0].trim() !== '') {
        setChat((prevChat) => [...prevChat, { text: response, type: 'bot' }]);
      }
    });
  }, []);
  
  return (
    <div className='vh-100   text-light row'>

      <aside className='sidemenu col-2 border-2 border-secondary p-4 d-flex flex-column' style={{ borderRight: "3px solid white", backgroundColor: "#202123" }}>
        <div className='d-flex align-items-center justify-content-center mb-4'>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Google_PaLM_Logo.svg/800px-Google_PaLM_Logo.svg.png" alt="" style={{width:"44px" , height:"44px" ,borderRadius:"50%"}}/>
          <h2 className='text-center m-2'>PALM AI</h2>
        </div>
        <button className='btn btn-outline-light rounded-2 text-start p-2 d-flex align-items-center'>
          <span className='fw-bold ms-3 me-2 fs-6'>+</span> New Chat
        </button>
      </aside>
      <section className='col-10 ' style={{ backgroundColor: "#343541" }}>
        <div className=' p-4 position-relative  ' style={{ height: "100%" }}>



          <div className='chat-log p-5 overflow-y-scroll  ' style={{height:"50rem"}}>
            {chat.map((entry,index)=>(
            <div className={`${entry.type} chat-message m-5  mt-4 p-5 d-flex gap-3  shadow fs-6 `} key={index}  >
              <div className="avatar">
                <img src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" alt="" style={{ borderRadius: "50%", height: "44px", width: "44px" }} />
              </div>
              <div className="messge fs-5">
              {entry.text}

              </div>
            </div>

            ))}

          

          </div>

          <div className='w-100 d-flex justify-content-center align-items-center position-absolute  gap-3 bottom-0 m-5'>

            <textarea name="" id="" className='w-75 shadow-lg p-2 text-light  bg-black bg-opacity-10 border-1  rounded-3 ' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type Your Message here ...'></textarea>
            <Send className='fs-3 ' style={{ cursor: "pointer" }} onClick={handleSendMessage} />
          </div>


        </div>
      </section>
    </div>
  )
}

export default App
