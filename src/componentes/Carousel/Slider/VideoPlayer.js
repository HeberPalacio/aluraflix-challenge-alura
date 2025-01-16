import React, { useContext } from 'react';
import ReactPlayer from "react-player";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MyContext from '../../../Context';

import Fab from '@mui/material/Fab';

const VideoContainer = styled.div`
  width: auto;
  height: 80vh;
  position:relative;
  background-color:#191919;
  padding-top:1rem;
`;

const StyledPlayer = styled(ReactPlayer)`
   position:relative;
`;

const PlayerWrapper = styled.div`
    display:flex;
    flex-direction:column;
    max-width:60%;
    height:60vh;
    margin: 0 20%;
    
    & .boton {
      align-self:flex-end;
      padding:0.5rem;
      font-size:1.3rem;
      margin-bottom:0.5rem;
    }

    & .spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
`;

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { videoToPlay } = useContext(MyContext); // Obtiene la URL del video desde el contexto
  console.log("videoToPlay:", videoToPlay);
  const volverMain = () => {
    navigate('/'); // Navega al inicio
  };

  return (
    <VideoContainer>
      <PlayerWrapper>
        <Fab color="primary" aria-label="add" className="boton" onClick={volverMain}>
          X
        </Fab>
        {/* Verifica si videoToPlay está definido antes de intentar reproducir el video */}
        {videoToPlay ? (
          <StyledPlayer url={videoToPlay} width="100%" height="100%" />
        ) : (
          <p>No se ha seleccionado un video válido.</p> // Mensaje si no se encuentra una URL válida
        )}
      </PlayerWrapper>
    </VideoContainer>
  );
};

export default VideoPlayer;
