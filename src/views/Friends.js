import React from "react";
import styled from "styled-components";
import { Button } from './design/Button';

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const FriendsName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
  font-size: 17px;
  padding-right: 60px;
  
`;



/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const Friends = ({ friends, f_onClick }) => {
    return (
        <Container onClick="f_onClick">
            <FriendsName>{friends.name}</FriendsName>
            { f_onClick ? <Button onClick={f_onClick}>View Profile</Button> : "" }
        </Container>
    );
};

export default Friends;