import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 64px;
  width: 64px;
  border-radius: 100%;
  margin: 0;
  border: solid white 4px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.7);
`;


const Colour = ({ colour, f_onClick }) => {
  return (
    <Container onClick={f_onClick} style={{ background: colour }}>
    </Container>
  );
};

export default Colour;
