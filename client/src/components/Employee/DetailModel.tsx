import React, { FC, useEffect } from "react";
import {
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
  Avatar,
} from "@chakra-ui/react";
import moment from "moment";

interface DetailModalProps {
  data: any;
  setIsVisible: Function;
}

const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const DetailModel: FC<DetailModalProps> = (props: DetailModalProps) => {
  const { data, setIsVisible } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  useEffect(() => {
    setOverlay(<OverlayOne />);
    onOpen();
  }, [data]);

  const residents = JSON.parse(data.residents);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setIsVisible(false);
      }}
    >
      {overlay}
      <ModalContent>
        <ModalHeader>About Employee</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {data && (
            <VStack>
              <Avatar
                src={data.image[0].url}
                rounded="full"
                height={20}
                width={20}
              />
              <HStack>
                <Heading as={"h6"} size={"sm"} alignContent={"start"}>
                  Full Name
                </Heading>
                <Text>{data.name+" "+data.lastName}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  Email
                </Heading>
                <Text>{data.email}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  DOB
                </Heading>
                <Text>{moment(data.dob).format("DD-MM-YYYY")}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  Qualifications
                </Heading>
                <Text>{data.qualifications}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  Country
                </Heading>
                <Text>{residents.country}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  State
                </Heading>
                <Text>{residents.state}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  City
                </Heading>
                <Text>{residents.city}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  Pincode
                </Heading>
                <Text>{residents.pincode}</Text>
              </HStack>
              <HStack>
                <Heading as={"h6"} size={"sm"}>
                  Address
                </Heading>
                <Text>{residents.address}</Text>
              </HStack>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onClose();
              setIsVisible(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailModel;
