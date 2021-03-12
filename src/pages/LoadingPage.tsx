import { CircularProgress } from '@material-ui/core';

import React from 'react';
import styled from 'styled-components';

const LoadingPageDiv = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCircularProgress = styled(CircularProgress)``;

const StyledLoadingText = styled.p`
  margin-left: 10px;
`;

const LoadingPage = (): JSX.Element => {
  return (
    <LoadingPageDiv>
      <StyledCircularProgress />
      <StyledLoadingText>読込中です...</StyledLoadingText>
    </LoadingPageDiv>
  );
};

export default LoadingPage;
