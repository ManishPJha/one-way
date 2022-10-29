import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
} from "@chakra-ui/react";

import { loginOperator, clearErrors } from "../redux/auth/action";

interface AuthStateProps {
  loading?: boolean;
  auth?: any;
  user?: object;
  authenticated?: boolean;
  error: any;
}

const Login = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, authenticated, user, error }: AuthStateProps = useSelector(
    (state: AuthStateProps) => state.auth
  );

  const handleLoginAction = (e: any) => {
    e.preventDefault();

    const { email, password } = e.target;

    if (email && password) {
      dispatch(
        loginOperator({
          email: email.value,
          password: password.value,
        })
      );
    }
    navigate("/home");
  };

  useEffect(() => {
    error && !error.includes("You need to login first!") && alert.error(error);
    dispatch(clearErrors()); //clear errors
  }, [error]);

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Sign in to your account</Heading>
          <form onSubmit={handleLoginAction}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" id="_email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" id="_password" />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.500"}>Forgot password?</Link>
              </Stack>
              <Button colorScheme={"blue"} variant={"solid"} type="submit">
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
};

export default Login;
