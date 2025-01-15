import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from "styled-components";
import logo from '../assets/LogoMain.png';
import Button from '../componentes/Button';

// Estilos del contenedor principal del header
const HeaderContainer = styled.div`
  background-color: #262626;
  font-size: 32px;
  color: white;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 320px;
  border-bottom: 2px solid #2A7AE4;
  padding: 0 2rem; /* Espacio horizontal */
`;

// Estilos del logo
const Logo = styled.img`
  max-height: 40%;
  margin-left: 2%;

  ${props => css`
    @media (max-width: ${props.theme.breakpoints.laptop}) {
      margin: 0 auto;
    }
  `}
`;

// Contenedor para agrupar los botones
const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem; /* Espacio entre botones */
`;

// Botón personalizado con box-shadow al pasar el cursor
const CustomButton = styled(Button)`
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0px 0px 7px ${(props) => props.inputColor || "blue"};
  }
`;

const Header = () => {
  const navigate = useNavigate();

  const volverMain = () => {
    navigate('/');
  };

  function handleClick(route) {
    navigate(route);
  }

  return (
    <HeaderContainer>
      {/* Logo */}
      <Logo src={logo} onClick={volverMain} alt="Aluraflix Logo" />

      {/* Botones agrupados en un contenedor */}
      <ButtonContainer>
        <CustomButton 
          onClick={() => handleClick('/')} 
          inputColor="#6BD1FF" 
          bordercolor='#6BD1FF' 
          fontSize="1rem" 
          btnwidth="8rem" 
          height="3rem"
        >
          HOME
        </CustomButton>

        <CustomButton 
          onClick={() => handleClick('/formulariovideos')} 
          inputColor="white" 
          bordercolor='white' 
          fontSize="1rem" 
          btnwidth="8rem" 
          height="3rem"
        >
          NUEVO VIDEO
        </CustomButton>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default Header;
