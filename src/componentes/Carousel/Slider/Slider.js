import React, { useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/swiper-bundle.css";
import styled, { css } from "styled-components";
import MyContext from "../../../Context";
import axios from "axios"; // Importamos axios
import { useSnackbar } from "notistack";

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

function Slider({ categorias, videos }) {
  //const { enqueueSnackbar } = useContext(MyContext);
  const { enqueueSnackbar } = useSnackbar();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [videoList, setVideos] = useState([]); // Estado para manejar los videos

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/videos");
      setVideos(response.data); // Actualiza la lista de videos
    } catch (error) {
      console.error("Error al obtener los videos:", error);
    }
  };

  // Lógica para eliminar video
  const deleteVideo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/videos/${id}`);
      fetchVideos(); // Actualiza la lista de videos después de eliminar
      enqueueSnackbar("Video eliminado correctamente", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
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

  const handleEditClick = (id) => {
    // Aquí se puede agregar la lógica para abrir el formulario de edición
    console.log(`Editando el video con ID: ${id}`);
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
                    <div className="videoContainer">
                      <img
                        className="videoImage"
                        src={video.linkImagenVideo}
                        alt="video"
                      />
                      <div className="buttons">
                        <button onClick={() => handleDeleteClick(video.id)}>
                          <img src="/imagenes/delete-icon.png" alt="Delete" /> Borrar
                        </button>
                        <button onClick={() => handleEditClick(video.id)}>
                          <img src="/imagenes/edit-icon.png" alt="Edit" /> Editar
                        </button>
                      </div>
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
