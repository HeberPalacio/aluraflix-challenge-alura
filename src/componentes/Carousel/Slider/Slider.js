import React, { useState, useEffect, useContext } from "react";  // Agregado useEffect
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/swiper-bundle.css";
import styled, { css } from "styled-components";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import MyContext from '../../../../src/Context';
import { Link } from 'react-router-dom';


// const VideoPlayer = () => {
//   const location = useLocation(); // Obtener la ubicación actual
//   const queryParams = new URLSearchParams(location.search); // Obtener los parámetros de la URL
//   const videoUrl = queryParams.get('videoUrl'); // Obtener el parámetro 'videoUrl'

//   const [url, setUrl] = useState('');

//   useEffect(() => {
//     if (videoUrl) {
//       setUrl(videoUrl); // Establecer la URL del video en el estado
//     } else {
//       console.log("No videoUrl in query params");
//     }
//   }, [videoUrl]);

//   return (
//     <div>
//       {url ? (
//         <ReactPlayer url={url} controls={true} />
//       ) : (
//         <p>No video available</p> // Mensaje si no se encuentra el video
//       )}
//     </div>
//   );
// };

const CategoryContainer = styled.div`
  color: #ffff;
  display: flex;
  text-transform: uppercase;
  font-weight: bold;
  height: 5rem;
  align-items: center;
  & .textoCategoria {
    margin-left: 1rem;
    color: #f5f5f5;
    flex: wrap;
  }

  @media screen and (min-width: 992px) {
    display: ${(props) => props.isHidden && "none"};
  }

  ${(props) => css`
    @media (max-width: ${props.theme.breakpoints.laptop}) {
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      & .textoCategoria {
        margin-left: 0rem;
      }
    }
  `}
`;

const CategoriaTitulo = styled.div`
  display: flex;
  background-color: ${(props) => props.categoriaColor};
  width: auto;
  padding: 1rem;
  height: 60%;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  border-radius: 15px;
`;

const SwiperContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledSwiper = styled(Swiper)`
  padding: 20px 0;

  .swiper-button-prev,
  .swiper-button-next {
    color: #fff;
    font-size: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #257be5;
      height: 5rem;
      width: 5rem;
    }
  }

  .swiper-button-prev {
    left: 10px;
  }

  .swiper-button-next {
    right: 10px;
  }
`;

const StyledSwiperSlide = styled(SwiperSlide)`
  -webkit-transition: 250ms all;
  transition: 250ms all;
  cursor: pointer;
  text-align: center;
  font-size: 18px;

  & .videoContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 4px solid ${(props) => props.borderColor};
    border-radius: 15px;
    box-shadow: 0 0 10px ${(props) => props.borderColor};
    transition: transform 0.3s ease;
  }

  &:hover .videoContainer {
    transform: translateY(-5px);
  }

  & .videoImage {
    width: 100%;
    border-radius: 15px;
  }

  & .buttons {
    display: flex;
    width: 100%;
    gap: 2rem;
    justify-content: center;
    margin: 0.7rem 0;
  }

  & .buttons button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: transparent;
    color: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
    transition: color 0.3s, box-shadow 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  & .buttons button img {
    width: 30px;
    height: 30px;
  }

  & .buttons button:hover {
    box-shadow: 0 0 8px rgb(107, 209, 255);
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  & .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    color: black;
  }

  & .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  & button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(19, 19, 19, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  & .modal-content {
    background: #f5f5f5;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    color: black;
    width: 800px;
    height: 500px;
    border-width: 6px;
    border-style: solid;
    border-color: rgb(0, 255, 221);
    box-shadow: 0 0 15px rgba(0, 255, 221, 0.5); /* luz difusa */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto; /* Habilita el desplazamiento vertical si es necesario */
  }

  & .form-group {
    margin-bottom: 1rem;
  }

  & label {
    display: block;
    margin-bottom: 0.5rem;
  }

  & input,
  & textarea,
  & select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  & .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  & button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;


function Slider({ categorias, videos }) {
  const { enqueueSnackbar } = useSnackbar();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [videoList, setVideos] = useState(videos);
  const { forceUpdate } = useContext(MyContext);
  const {handleVideoLoading ,setVideoToPlay} = useContext(MyContext) ;
  //const { control, handleSubmit, reset, formState: { errors } } = useForm();

  // const navigate = useNavigate();

  // const handleVideoClick = (videoUrl) => {
  //   console.log(videoUrl);
  //   navigate(`/video-player?videoUrl=${encodeURIComponent(videoUrl)}`);
  // };

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Error al obtener los videos:", error);
    }
  };

  const deleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/videos/${id}`);
      fetchVideos();
      enqueueSnackbar("Video eliminado correctamente", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      forceUpdate();
    } catch (error) {
      console.error("Error al eliminar el video:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setVideoToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteVideo(videoToDelete);
    setShowConfirmation(false);
  };

  const handleEditClick = (video) => {
    console.log(video)
    setVideoToEdit(video);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedData = { ...videoToEdit };
      console.log(updatedData, 'data')
      // Si se seleccionó una nueva imagen, subirla a Cloudinary
      if (videoToEdit.linkImagenVideo.startsWith('data:')) {
        const formData = new FormData();
        formData.append('file', e.target.videoImage.files[0]); // Archivo de imagen
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
  
        updatedData.linkImagenVideo = response.data.secure_url; // Actualiza con la URL de Cloudinary
      }
  
      // Enviar datos actualizados al servidor
      await axios.put(`http://localhost:3001/videos/${videoToEdit.id}`, updatedData);
  
      enqueueSnackbar('Video actualizado correctamente', { variant: 'success' });
      setShowEditModal(false);
      fetchVideos(); // Refresca la lista de videos
      forceUpdate();
    } catch (error) {
      console.error('Error al actualizar el video:', error);
      enqueueSnackbar('Error al guardar los cambios', { variant: 'error' });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setVideoToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file, 'file')
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoToEdit((prev) => ({
          ...prev,
          linkImagenVideo: reader.result,  // Aquí se actualiza la imagen de portada
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCategories = categorias.filter((categoria) =>
    videos.some((video) => video.Categoria === categoria.categoriaNombre)
  );

  return (
    <div>
      {showConfirmation && (
        <ConfirmationModal>
          <div className="modal-content">
            <p>¿Estás seguro de que deseas eliminar este video?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete}>Sí</button>
              <button onClick={() => setShowConfirmation(false)}>No</button>
            </div>
          </div>
        </ConfirmationModal>
      )}

      {showEditModal && (
        <EditModal>
          <div className="modal-content">
            <h3>Editar Video</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="titulo">Título</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={videoToEdit.titulo}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkYoutube">Link de YouTube</label>
                <input
                  type="text"
                  id="linkYoutube"
                  name="linkVideo"
                  value={videoToEdit.linkVideo}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="videoImage">Imagen de portada</label>
                {videoToEdit.linkImagenVideo && (
                  <div>
                    <img 
                      src={videoToEdit.linkImagenVideo} 
                      alt="Portada actual" 
                      style={{ width: '100px', height: 'auto', marginBottom: '10px' }} 
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="videoImage"
                  name="videoImage"
                  onChange={handleImageChange}  // Llamada al nuevo handler
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoria">Cambiar categoría</label>
                <select
                  id="categoria"
                  name="Categoria"
                  value={videoToEdit.Categoria}
                  onChange={handleEditChange}
                >
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.categoriaNombre}>
                      {categoria.categoriaNombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={videoToEdit.descripcion}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="codigoSeguridad">Código de seguridad</label>
                <input
                  type="text"
                  id="codigoSeguridad"
                  name="codigoSeguridad"
                  value={videoToEdit.codigoSeguridad}
                  onChange={handleEditChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit">Guardar cambios</button>
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </EditModal>
      )}

      <SwiperContainer>
        {filteredCategories.map((categoria) => (
          <div key={categoria.categoriaNombre}>
            <CategoryContainer isHidden={categoria.categoriaNombre === "Front End"}>
              <CategoriaTitulo categoriaColor={categoria.categoriaColor}>
                {categoria.categoriaNombre}
              </CategoriaTitulo>
              <div className="textoCategoria">{categoria.categoriaTexto}</div>
            </CategoryContainer>

            <StyledSwiper
              spaceBetween={10}
              slidesPerView={4}
              slidesPerGroup={2}
              navigation
              modules={[Navigation]}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
            >
              {videos
              .filter((video) => video.Categoria === categoria.categoriaNombre)
              .map((video) => (
                <StyledSwiperSlide key={video.id} borderColor={categoria.categoriaColor}>
                  <Link to={"/videoPlayer"}>
                  <div
                    className="videoContainer"
                    onClick={() => handleVideoLoading(video.linkVideo)} // Maneja la carga del video
                  >
                  
                    <img className="videoImage" src={video.linkImagenVideo} alt="video" />
                    </div>
                    </Link>
                    <div className="buttons">
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(video.id);
                        }}
                      >
                        <img src="/imagenes/delete-icon.png" alt="Delete" /> Borrar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(video);
                        }}
                      >
                        <img src="/imagenes/edit-icon.png" alt="Edit" /> Editar
                      </button>
                    </div>
                  
                  
                </StyledSwiperSlide>
              ))}
            </StyledSwiper>
          </div>
        ))}
      </SwiperContainer>
    </div>
  );
}

export default Slider;
