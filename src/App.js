import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import './App.css';
import axios from "axios";
import Draggable, {DraggableCore} from 'react-draggable'; // <DraggableCore>
import domtoimage from 'dom-to-image';


function App() {
  let imageAreaRef = useRef(null);

  const [templates, setTemplates] = useState(null)
  const [firstTitle, setFirstTitle] = useState('');
  const [secondTitle, setSecondTitle] = useState('');
  const [randomNumber, setRandomNumber] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const genRandomNumber = () => {
    setUploadedImage(null);
    setRandomNumber(Math.floor(Math.random() *100))
  }

  useEffect(async () => {
    await axios.get('https://api.imgflip.com/get_memes')
      .then(response => {
        setTemplates(response.data.data.memes);
        genRandomNumber();
        console.log(response.data.data.memes)
      });

      //imageAreaRef.current.focus();

  }, []);

  const onSelectFileHandler = event =>{
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0])
  }

  const onUploadHandler = () => {
    let src = URL.createObjectURL(selectedFile);
    setUploadedImage(src);
    console.log(src);
  }

  const exportImageHandler = () => {
    imageAreaRef.current.focus();
    
    console.log(selectedFile);
    domtoimage.toJpeg(imageAreaRef.current, { quality: 0.95 })
    .then(function (dataUrl) {
        let link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
    });
  }

  return ( 
    <div>
      <h1>Meme Generator</h1>
      <br/>
      <div className="input-area">
        <div>
          <label htmlFor = "first-title">First Title</label>
          <input onChange={(e)=>setFirstTitle(e.target.value)} value={firstTitle} name="first-title" id="first-title" type="text"/>
        </div>
        <div>
          <label htmlFor = "second-title">Second Title</label>
          <input onChange={(e)=>setSecondTitle(e.target.value)} value={secondTitle} name="second-title" id="second-title" type="text"/>
        </div>
      </div>
      { templates ?
      <div>
        <div ref={imageAreaRef} className="meme-contents">  
          <img src={uploadedImage ? uploadedImage : templates[randomNumber].url} className="meme-contents__meme-image"/> 
          <Draggable>
            <div className="meme-contents__firstTitle">{firstTitle}</div>
          </Draggable>
          <Draggable>
            <div className="meme-contents__secondTitle">{secondTitle}</div>
          </Draggable>
        </div>
      
        <div className="img-selections">
          <button onClick={() => { setUploadedImage(null); setRandomNumber(randomNumber - 1)}}>Previous</button>
          <button onClick={() => { setUploadedImage(null); setRandomNumber(randomNumber + 1)}}>Next </button>
          <button onClick={genRandomNumber}>Pick random</button>
        </div>
        <hr/>
        <div className="upload-area">
          <input type="file" name="file" onChange={onSelectFileHandler}/>
          <button type="button" className="" onClick={onUploadHandler}>Upload</button> 
          {/* <input type= "remove" name="remove" */}
        </div>
        <hr/>
        <div className="export-image-area">
          <button onClick={exportImageHandler}>export image</button>
        </div>
      </div>
      : <p>loading image</p>
      }
      
    </div>
  );
}

export default App;