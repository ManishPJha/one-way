import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Box,
  Switch,
  IconButton,
  Button,
  HStack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaExpand } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTable } from "react-table";
import { useAlert } from "react-alert";
import moment from "moment";

import {
  getEmployees,
  clearErrors,
  updateEmployeeWithId,
} from "../../redux/Employee/action";
import DetailModel from "./DetailModel";

interface EmployeeStateProps {
  employee?: any;
  error: string;
  loading?: boolean;
  employees?: any;
}

const ModalRef = React.forwardRef((props, ref) => <></>);

const Employees: React.FC = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, error, employees }: EmployeeStateProps = useSelector(
    (state: EmployeeStateProps) => state.employee
  );

  // states
  const [isSalaried, setIsSalaried]: any = useState({});
  const [isIntern, setIsIntern]: any = useState(false);
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [modalState, setModalState] = useState({});

  const getExpandAction = () => {
    return isVisible;
  };

  const ref = React.createRef();

  const handleExpandAction = (row: any) => {
    if (row) {
      setIsVisible(true);
      setModalState(row);
    }
  };

  const columns: any = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }: any) => (
          <img
            src={value[0].url ? value[0].url : value}
            className="oneway-tbl-image"
          ></img>
        ),
      },
      {
        Header: "Date Of Birth",
        accessor: "dob",
        Cell: ({ value }: any) => <p>{moment(value).format("DD-MM-YYYY")}</p>,
      },
      {
        Header: "Email Address",
        accessor: "email",
      },
      {
        Header: "Salaried",
        accessor: "isSalaried",
        Cell: ({ value, ...rest }: any) => {
          const handleChangeAction = (event: any) => {
            const name = event.target.name;
            const checked = event.target.checked;
            setIsSalaried({ ...isSalaried, [name]: checked });
            dispatch(
              updateEmployeeWithId(rest.row.original._id, {
                isSalaried: checked,
              })
            );
            alert.success("Type is Updated Successfully.");
          };

          return (
            <Switch
              defaultChecked={value}
              isChecked={
                isSalaried[`salariedCheckbox-${rest.row.original._id}`]
              }
              name={`salariedCheckbox-${rest.row.original._id}`}
              onChange={(event) => handleChangeAction(event)}
            />
          );
        },
      },
      {
        Header: "Intern",
        accessor: "isIntern",
        Cell: ({ value, ...rest }: any) => {
          const handleChangeAction = (event: any) => {
            const name = event.target.name;
            const checked = event.target.checked;
            setIsIntern({ ...isIntern, [name]: checked });
            dispatch(
              updateEmployeeWithId(rest.row.original._id, {
                isIntern: checked,
              })
            );
            alert.success("Type is Updated Successfully.");
          };
          return (
            <Switch
              defaultChecked={value}
              isChecked={isSalaried[`internCheckbox-${rest.row.original._id}`]}
              name={`internCheckbox-${rest.row.original._id}`}
              onChange={(event) => handleChangeAction(event)}
            />
          );
        },
      },
      {
        Header: "Entry Date",
        accessor: "createdAt",
        Cell: ({ value }: any) => <p>{moment(value).format("MMMM Do YYYY")}</p>,
      },
      {
        Header: "Modified Date",
        accessor: "updatedAt",
        Cell: ({ value }: any) => <p>{moment(value).format("MMMM Do YYYY")}</p>,
      },
      {
        Header: "More",
        // accessor: "_id",
        Cell: ({ value, ...rest }: any) => {
          return (
            <Fragment>
              <IconButton
                aria-label="More_Btn"
                onClick={() => handleExpandAction(rest.cell.row.original)}
                icon={<FaExpand />}
              />
            </Fragment>
          );
        },
      },
      {
        Header: "Action",
        accessor: "_id",
        Cell: ({ value }: any) => {
          return (
            <Fragment>
              <HStack>
                <IconButton
                  aria-label="Edit_Btn"
                  onClick={() => window.alert(value)}
                  icon={<EditIcon />}
                />
                <IconButton
                  aria-label="Delete_Btn"
                  onClick={() => window.alert(value)}
                  icon={<DeleteIcon />}
                />
              </HStack>
            </Fragment>
          );
        },
      },
    ],
    [isSalaried]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: columns,
      data: data || [],
    });

  const fetchEmployeesData: Function = () => {
    dispatch(getEmployees());
  };

  useEffect(() => {
    //Fetch All Employees Dispatch Action
    fetchEmployeesData();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors()); //clear errors
    }
    setData(employees);
  }, [error, employees]);

  return (
    <Fragment>
      {isVisible && (
        <DetailModel
          data={modalState}
          setIsVisible={setIsVisible}
        ></DetailModel>
      )}
      <Flex direction={"column"}>
        <HStack spacing={{ base: "0", md: "6" }} justifyContent={"flex-end"}>
          <Button
            leftIcon={<AddIcon />}
            _hover={{
              bg: "teal.300",
            }}
            bg={useColorModeValue("teal.200", "gray.900")}
            mb={4}
            onClick={() => navigate("/admin/employees/add")}
          >
            Add
          </Button>
        </HStack>
        <Box bg={useColorModeValue("white", "gray.900")}>
          <TableContainer>
            <Table size="sm" {...getTableProps}>
              <Thead>
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          <Th {...column.getHeaderProps()}>
                            {
                              // Render the header
                              column.render("Header")
                            }
                          </Th>
                        ))
                      }
                    </Tr>
                  ))
                }
              </Thead>
              <Tbody {...getTableBodyProps}>
                {rows.map((row) => {
                  // Prepare the row for display
                  prepareRow(row);
                  return (
                    // Apply the row props
                    <Tr {...row.getRowProps()}>
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          // Apply the cell props
                          return (
                            <Td {...cell.getCellProps()}>
                              {
                                // Render the cell contents
                                cell.render("Cell")
                              }
                            </Td>
                          );
                        })
                      }
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </Fragment>
  );
};

export default Employees;
