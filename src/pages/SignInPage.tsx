import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Card, TextField } from '@material-ui/core';
import { GoogleLoginButton } from 'react-social-login-buttons';

const StyledWelcomeCard = styled(Card)`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 433px;
  height: 540px;
  transform: translate(-50%, -50%);
  //display: grid;
`;

const StyledNanomemoDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.palette.primary.dark};
  color: #fff;
  font-size: 61px;
  height: 94px;
  text-align: center;
  font-weight: bold;
`;

const StyledFormsGridDiv = styled.div`
  height: auto;
  padding: 37px 80px;
  //grid-gap: 33px;
  grid-auto-rows: 54px;
`;

const StyledGoogleLoginButton = styled(GoogleLoginButton)`
  margin: -5px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  height: 54px;
  margin-bottom: 33px;
`;

const StyledPrtition = styled.div`
  position: relative;
`;

const StyledPartition1 = styled.div`
  height: 32px;
  border-bottom: 0.9px solid #b5b5b5;
`;

const StyledPartition2 = styled.div`
  height: 32px;
`;

const StyledPartitionText = styled.div`
  width: 23%;
  background-color: #fff;
  color: #707070;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  font-size: 20px;
  transform: translate(-50%, -50%);
`;

const StyledSignInButton = styled(Button)`
  width: 100%;
  height: 52px;
`;

const StyledSignUpRouteButton = styled(Button)`
  position: fixed;
  bottom: 10px;
  right: 20px;
  font-size: 15px;
  text-transform: none;
`;

export default function SignInPage(props: {
  googleSignInFunc: () => Promise<void>;
  emailAndPasswordSignInFunc: (
    email: string,
    password: string
  ) => Promise<void>;
  authUser: firebase.default.User;
}): JSX.Element {
  if (props.authUser && props.authUser.emailVerified) {
    return <Redirect to="/" />;
  }

  const [emailStr, setEmailStr] = useState('');

  const [password, setPassword] = useState('');

  const emailFormError =
    !(emailStr.length === 0) &&
    !/^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
      emailStr
    );
  const passwordFormError = !(password.length === 0) && password.length < 8;

  const handleButtonOnClick = async () => {
    if (
      emailFormError ||
      passwordFormError ||
      emailStr.length === 0 ||
      password.length === 0
    ) {
      return;
    }

    await props.emailAndPasswordSignInFunc(emailStr, password);
  };

  return (
    <StyledWelcomeCard>
      <StyledNanomemoDiv>
        <span>nanomemo</span>
      </StyledNanomemoDiv>

      <StyledFormsGridDiv>
        <StyledGoogleLoginButton onClick={props.googleSignInFunc} />

        <StyledPrtition>
          <StyledPartition1 />
          <StyledPartition2 />
          <StyledPartitionText>or</StyledPartitionText>
        </StyledPrtition>

        <form noValidate autoComplete="on">
          <StyledTextField
            id="SignInEmail"
            name="Email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
            type="email"
            value={emailStr}
            error={emailFormError}
            onChange={(e) => setEmailStr(e.target.value)}
            label="email"
            variant="outlined"
            required
          />

          <StyledTextField
            id="SignInPassWd"
            name="PassWd"
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck="false"
            type="password"
            value={password}
            error={passwordFormError}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
            required
          />
        </form>

        <StyledSignInButton
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleButtonOnClick}
        >
          サインイン
        </StyledSignInButton>
      </StyledFormsGridDiv>

      <Link to="/sign-up">
        <StyledSignUpRouteButton variant="text" size="small">
          新規登録
        </StyledSignUpRouteButton>
      </Link>
    </StyledWelcomeCard>
  );
}
