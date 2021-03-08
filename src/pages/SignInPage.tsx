import React from 'react';
import styled from 'styled-components';

import { Button, Card } from '@material-ui/core';

const StyledSignInButton = styled(Button)`
  width: auto;
  height: auto;
`;

const StyledSignInPageDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledWelcomeCard = styled(Card)`
  position: absolute;
  top: 50%;
  margin: auto;
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function SignInPage(props: {
  signInFunc: () => void;
}): JSX.Element {
  return (
    <StyledSignInPageDiv>
      <StyledWelcomeCard>
        <StyledSignInButton variant="contained" onClick={props.signInFunc}>
          Google Signin
        </StyledSignInButton>
      </StyledWelcomeCard>
    </StyledSignInPageDiv>
  );
}
