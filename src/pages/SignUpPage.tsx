import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

export default function SignUpPage(): JSX.Element {
  return (
    <Link to="/sign-in">
      <Button>signinpage</Button>
    </Link>
  );
}
