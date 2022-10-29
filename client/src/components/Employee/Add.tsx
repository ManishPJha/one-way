import React, { FC, Fragment, useEffect, useState } from "react";
import {
  Box,
  VStack,
  InputGroup,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  Stack,
  HStack,
  Select,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAppState } from "../shared/AppProvider";
import Spinner from "../shared/Spinner";
import { addEmployee, clearErrors } from "../../redux/Employee/action";

interface joiningDdlProps {
  register: UseFormRegister<FieldValues>;
}

interface qualificationDdlProps {
  register: UseFormRegister<FieldValues>;
}

interface GlobeProps {
  id: number;
  iso2: string;
  name: string;
}

interface headerOptions {
  method: string;
  headers: Headers;
  redirect: any;
}

interface GlobeStates {
  country: string;
  state: string;
  city: string;
}

const Add: FC = () => {
  const [date, setDate] = useState<any>(new Date());
  const [trainingDuration, setTrainingDuration] = useState<any>(new Date());
  const [bondDuration, setBondDuration] = useState<any>(new Date());
  const [isSalaried, setIsSalaried] = useState<boolean>(false);
  const [isIntern, setIsIntern] = useState<boolean>(false);
  const [qualification, setQualification] = useState<string>("");
  const [countriesData, setCountriesData] = useState<Array<GlobeProps>>([]);
  const [stateData, setStateData] = useState<Array<GlobeProps>>([]);
  const [cityData, setCityData] = useState<Array<GlobeProps>>([]);
  const [globe, setGlobe] = useState<GlobeStates>({
    country: "",
    state: "",
    city: "",
  });
  const [image, setImage] = useState<any>([]);
  const [imagePreview, setImagePrview] = useState<any>([]);

  const [state, dispatch]: any = useAppState();
  const _loading = state.loading;
  const _dispatch = useDispatch();
  const alert = useAlert();
  const navigate: any = useNavigate();

  const { loading, error } = useSelector((state: any) => state.employee);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm();

  // GLOBE api configs
  let uri: string = import.meta.env.VITE_GLOBE_BASE_URI;
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", import.meta.env.VITE_GLOBE_API_KEY);
  var requestOptions: headerOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const QualificationDropdownList: React.FC<qualificationDdlProps> = ({
    register,
  }: qualificationDdlProps) => (
    <Select
      {...register("ddlQualifications", {
        onChange: (e) => {
          if (e.target.value !== undefined) setQualification(e.target.value);
        },
      })}
      value={qualification}
    >
      <option value={""}>-- Select Qualification --</option>
      <option value={"B.Tech/M.Tech"}>B.Tech/M.Tech</option>
      <option value={"BBA/MBA"}>BBA/MBA</option>
      <option value={"Diploma"}>Diploma</option>
      <option value={"B.E"}>B.E</option>
      <option value={"Other"}>Other</option>
    </Select>
  );

  const JoiningTypeDropdownList: React.FC<joiningDdlProps> = ({
    register,
  }: joiningDdlProps) => (
    <Select
      {...register("ddlJoiningType", {
        onChange: (event) => {
          let Value = event.target.value.toString().trim();
          if (Value === "salaried") {
            setIsSalaried(true);
            setIsIntern(false);
          } else if (Value === "intern") {
            setIsSalaried(false);
            setIsIntern(true);
          }
        },
      })}
      value={isSalaried ? "salaried" : isIntern ? "intern" : ""}
    >
      <option value={""}>-- Select Join Type --</option>
      <option value="salaried">Salaried</option>
      <option value="intern">Intern</option>
    </Select>
  );

  const fetchGlobeCountries = async () => {
    await fetch(uri.concat("/v1/countries"), requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: "loading", payload: false });
        setCountriesData(result);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchCountryStates = async (country: string) => {
    await fetch(
      uri.concat("/v1/countries/" + country + "/states"),
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: "loading", payload: false });
        setStateData(result);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchStateCities = async (state: string) => {
    await fetch(
      uri.concat(
        "/v1/countries/" + globe.country + "/states/" + state + "/cities"
      ),
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: "loading", payload: false });
        setCityData(result);
      })
      .catch((error) => console.log("error", error));
  };

  const handleCountryEvent = (country: string) => {
    if (country) {
      setGlobe({ ...globe, country: country });
      fetchCountryStates(country);
    }
  };

  const handleStateEvent = (state: string) => {
    if (state) {
      setGlobe({ ...globe, state: state });
      fetchStateCities(state);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors()); //clear errors
    }
  }, [error]);

  useEffect(() => {
    dispatch({ type: "loading", payload: true });
    fetchGlobeCountries();
  }, []);

  if (isSubmitSuccessful) {
    return navigate("/admin/employees");
  }

  return !_loading ? (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="lg"
      p={8}
      color={useColorModeValue("gray.700", "whiteAlpha.900")}
      shadow="base"
    >
      <Heading as={"h4"} size={"md"} mb={2}>
        Add Employee
      </Heading>
      <Divider />
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit((data, event) => {
          event?.preventDefault();
          // console.log(`data ----- >`, data);
          const formData = new FormData();
          let residents = {
            address: data.address,
            country: data.ddlCountry,
            state: data.ddlState,
            city: data.ddlCity,
            pincode: data.pincode,
          };
          formData.append("name", data.name);
          formData.append("lastName", data.lastname);
          formData.append("image", image);
          formData.append("dob", date);
          formData.append("email", data.email);
          formData.append("qualifications", data.ddlQualifications);
          formData.append("isSalaried", isSalaried.toString());
          formData.append("isIntern", isIntern.toString());
          formData.append("trainingDuration", trainingDuration);
          formData.append("bondDuration", bondDuration);
          formData.append("residents", JSON.stringify(residents));

          _dispatch(addEmployee(formData));
        })}
      >
        <HStack mt={5}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>

            <InputGroup>
              <Input type="text" {...register("name")} />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>

            <InputGroup>
              <Input type="text" {...register("lastname")} />
            </InputGroup>
          </FormControl>
        </HStack>
        <HStack mt={5}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>

            <InputGroup>
              <Input type="email" {...register("email")} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>DOB</FormLabel>
            <SingleDatepicker
              name="dob"
              date={date}
              onDateChange={setDate}
            ></SingleDatepicker>
          </FormControl>
        </HStack>
        <HStack mt={5} spacing={{ base: "0", md: "6" }}>
          <FormControl isRequired>
            <FormLabel>Image</FormLabel>
            <Input
              type={"file"}
              {...register("image", {
                onChange: (event) => {
                  const files = Array.from(event.target.files);

                  const reader = new FileReader();

                  setImagePrview([]);
                  setImage([]);

                  files.map((file: any) => {
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setImagePrview((oldImage: any) => [
                          ...oldImage,
                          reader.result,
                        ]);
                        setImage((oldImage: any) => [
                          ...oldImage,
                          reader.result,
                        ]);
                      }
                    };

                    reader.readAsDataURL(file);
                  });
                },
              })}
              accept=".jpg,.jpeg,.png"
              onError={(error) => console.log(error)}
            ></Input>
          </FormControl>
          <FormControl maxW={50} margin={"unset"}>
            {imagePreview.length > 0 &&
              imagePreview.map((img: any) => (
                <img
                  src={img}
                  key={img}
                  alt="image preview"
                  width={54}
                  height={50}
                  style={{ marginTop: 30 }}
                ></img>
              ))}
          </FormControl>
          <FormControl>
            <Stack direction={"row"}>
              <FormControl>
                <FormLabel>Qualifications</FormLabel>
                <QualificationDropdownList register={register} />
              </FormControl>
              <FormControl>
                <FormLabel>Joining Type</FormLabel>
                <JoiningTypeDropdownList register={register} />
              </FormControl>
            </Stack>
          </FormControl>
        </HStack>
        <HStack mt={5}>
          {isIntern && (
            <FormControl>
              <FormLabel>Training Duration</FormLabel>
              <SingleDatepicker
                name="trainingDuration"
                date={trainingDuration}
                onDateChange={setTrainingDuration}
              ></SingleDatepicker>
            </FormControl>
          )}
          {isSalaried && (
            <FormControl>
              <FormLabel>Bond Duration</FormLabel>
              <SingleDatepicker
                name="bondDuration"
                date={bondDuration}
                onDateChange={setBondDuration}
              ></SingleDatepicker>
            </FormControl>
          )}
          <FormControl isRequired maxW={400}>
            <FormLabel>Pin Code</FormLabel>
            <Input
              type={"text"}
              {...register("pincode")}
              maxLength={10}
            ></Input>
          </FormControl>
        </HStack>
        <HStack mt={5}>
          <FormControl isRequired>
            <FormLabel>Address</FormLabel>
            <Textarea {...register("address")} rows={8} resize="none" />
          </FormControl>
          <FormControl>
            <VStack align={"start"}>
              <FormLabel>Country</FormLabel>
              <Select
                {...register("ddlCountry")}
                onChange={(event) => handleCountryEvent(event.target.value)}
              >
                <option>--- Select Country ---</option>
                {countriesData.map((val, index) => {
                  return (
                    <option key={index} id={val.id.toString()} value={val.iso2}>
                      {val.name}
                    </option>
                  );
                })}
              </Select>
              {stateData && stateData.length > 0 && (
                <Fragment>
                  <FormLabel>State</FormLabel>
                  <Select
                    {...register("ddlState")}
                    onChange={(event) => handleStateEvent(event.target.value)}
                  >
                    <option>--- Select State ---</option>
                    {stateData.map((val, index) => {
                      return (
                        <option
                          key={index}
                          id={val.id.toString()}
                          value={val.iso2}
                        >
                          {val.name}
                        </option>
                      );
                    })}
                  </Select>
                </Fragment>
              )}
              {cityData && cityData.length > 0 && (
                <Fragment>
                  <FormLabel>City</FormLabel>
                  <Select {...register("ddlCity")}>
                    <option>--- Select City ---</option>
                    {cityData.map((val, index) => {
                      return (
                        <option
                          key={index}
                          id={val.id.toString()}
                          value={val.iso2}
                        >
                          {val.name}
                        </option>
                      );
                    })}
                  </Select>
                </Fragment>
              )}
            </VStack>
          </FormControl>
        </HStack>
        <HStack
          mt={5}
          spacing={{ base: "0", md: "6" }}
          justifyContent={"flex-end"}
        >
          <Button
            colorScheme="blue"
            bg="blue.400"
            color="white"
            _hover={{
              bg: "blue.500",
            }}
            type="submit"
          >
            Submit
          </Button>
          <Button
            colorScheme="red"
            bg="red"
            color="white"
            _hover={{
              bg: "red.500",
            }}
            type="reset"
          >
            Cancel
          </Button>
        </HStack>
      </form>
    </Box>
  ) : (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
      className="one-spinner"
    />
  );
};

export default Add;
