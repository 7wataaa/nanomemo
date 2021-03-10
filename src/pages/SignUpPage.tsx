import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Card, TextField } from '@material-ui/core';
import { GoogleLoginButton } from 'react-social-login-buttons';

const isEmailAddress = (str: string) =>
  /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
    str
  );

const StyledSignUpCard = styled(Card)`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 433px;
  height: auto;
  transform: translate(-50%, -50%);
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
  grid-auto-rows: 54px;
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

const StyledTextField = styled(TextField)`
  width: 100%;
  height: 54px;
  margin-bottom: 33px;
`;

const StyledSignUpButton = styled(Button)`
  width: 100%;
  height: 52px;
`;

const StyledSignInRouteButton = styled(Button)`
  display: block;
  margin: auto 20px 10px auto;
  font-size: 15px;
  text-transform: none;
`;

export default function SignUpPage(props: {
  googleSignInFunc: () => Promise<void>;
  createEmailSignInUser: (email: string, password: string) => Promise<void>;
  isLogin: boolean;
}): JSX.Element {
  const [emailStr, setEmailStr] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const emailFormError = !(emailStr.length === 0) && !isEmailAddress(emailStr);

  const passwordFormError = !(password.length === 0) && password.length < 8;

  const confirmFormError = password !== confirmPassword;

  const handleButtonOnClick = () => {
    if (
      emailFormError ||
      passwordFormError ||
      confirmFormError ||
      emailStr.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      return;
    }

    props.createEmailSignInUser(emailStr, password);
  };

  if (props.isLogin) {
    return <Redirect to="/" />;
  }

  return (
    <StyledSignUpCard>
      <StyledNanomemoDiv>nanomemo</StyledNanomemoDiv>

      <StyledFormsGridDiv>
        <GoogleLoginButton onClick={props.googleSignInFunc} />

        <StyledPrtition>
          <StyledPartition1 />
          <StyledPartition2 />
          <StyledPartitionText>or</StyledPartitionText>
        </StyledPrtition>

        <StyledTextField
          variant="outlined"
          label="email"
          type="email"
          required
          value={emailStr}
          onChange={(e) => setEmailStr(e.target.value)}
          error={emailFormError}
        />

        <StyledTextField
          variant="outlined"
          label="Password"
          type="password"
          placeholder="最低8文字必要です"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordFormError}
        />

        <StyledTextField
          variant="outlined"
          label="Password 確認"
          type="password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmFormError}
        />

        <StyledSignUpButton
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleButtonOnClick}
        >
          確認メールを送信
        </StyledSignUpButton>
      </StyledFormsGridDiv>

      <Link to="/sign-in">
        <StyledSignInRouteButton variant="text" size="small">
          Sign in
        </StyledSignInRouteButton>
      </Link>
    </StyledSignUpCard>
  );
}
