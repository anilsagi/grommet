import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Data,
  DataTable,
  Heading,
  Image,
  Layer,
  List,
  Pagination,
  Paragraph,
  ResponsiveContext,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TextInput,
} from "grommet";
import { Close, Edit, FormSearch, More, Refresh, Trash } from "grommet-icons";

const USERS_URL = "/api/users";
const PAGE_SIZE = 5;

const ListItem = ({ children, ...props }) => (
  <Box as="li" pad="small" border={{ color: "light-4", side: "bottom" }} {...props}>
    {children}
  </Box>
);

const normalizeUser = (user) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  company: user.company?.name || "Not provided",
  image: user.image,
  details: {
    location: `${user.address?.city || "Unknown"}, ${user.address?.stateCode || "--"}`,
    role: user.role || "user",
  },
});

const statusMessage = (state) => {
  if (state.loading) return "Loading users...";
  if (state.error) return state.error;
  if (state.users.length === 0) return "No users match your search.";
  return "";
};

const IconAction = ({ icon, label, color, onClick }) => (
  <Button
    icon={icon}
    color={color}
    a11yTitle={label}
    onClick={(event) => {
      event.stopPropagation();
      onClick(event);
    }}
    plain
  />
);

const UserCard = ({ user, onAction }) => (
  <Card background="light-1" pad="small" gap="small">
    <CardHeader direction="row" justify="between" align="center" pad="small">
      <Box direction="row" align="center" gap="small">
        <Image src={user.image} width="48px" height="48px" fit="cover" alt={`${user.name} profile`} />
        <Box>
          <Text weight="bold">{user.name}</Text>
          <Text size="small" color="dark-3">{user.company}</Text>
        </Box>
      </Box>
      <IconAction icon={<More color="brand" />} color="brand" label="More" onClick={() => onAction("More", user)} />
    </CardHeader>
    <CardBody pad="small" gap="xsmall">
      <Text size="small">{user.email}</Text>
      <Text size="small" color="dark-3">{user.details.location} · {user.details.role}</Text>
    </CardBody>
    <CardFooter pad="small" direction="row" justify="end" gap="small">
      {/* <Button label="Edit" color="status-warning" icon={<Edit color="status-warning" />} onClick={() => onAction("Edit", user)} /> */}
      {/* <Button label="Delete" color="status-critical" icon={<Trash color="status-critical" />} onClick={() => onAction("Delete", user)} /> */}
    </CardFooter>
  </Card>
);

const Datadisplay = ({ onClose }) => {
  const [state, setState] = useState({ users: [], loading: true, error: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ property: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      setState((current) => ({ ...current, loading: true, error: "" }));
      try {
        const response = await fetch(USERS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const payload = await response.json();
        setState({
          users: (payload.users || []).map(normalizeUser),
          loading: false,
          error: "",
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setState({ users: [], loading: false, error: "Unable to load users. Try again." });
        }
      }
    };

    loadUsers();
    return () => controller.abort();
  }, [reload]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchingUsers = state.users.filter((user) =>
      [user.name, user.email, user.company].some((value) => value.toLowerCase().includes(query)),
    );

    return [...matchingUsers].sort((first, second) => {
      const firstValue = String(first[sort.property] || "").toLowerCase();
      const secondValue = String(second[sort.property] || "").toLowerCase();
      const result = firstValue.localeCompare(secondValue);
      return sort.direction === "asc" ? result : -result;
    });
  }, [search, sort, state.users]);

  const pageUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSort = (nextSort) => {
    if (!nextSort?.property || !["name", "email", "company"].includes(nextSort.property)) return;
    setSort(nextSort);
    setPage(1);
  };

  const handleAction = (action, user) => {
    if (!user?.name) return;
    if (action === "Delete") {
      setState((current) => ({
        ...current,
        users: current.users.filter((item) => item.id !== user.id),
      }));
      setSelected((current) => current.filter((id) => id !== user.id));
      setNotice(`${user.name} was removed from the table.`);
      return;
    }

    setNotice(`${action} action selected for ${user.name}.`);
  };

  const columns = [
    { property: "name", header: "Name", primary: true, sortable: true },
    { property: "email", header: "Email", sortable: true },
    { property: "company", header: "Company", sortable: true },
    {
      property: "actions",
      header: "Actions",
      sortable: false,
      render: (user) => (
        <Box direction="row" gap="small" align="center" flex={{ shrink: 0 }}>
          <IconAction icon={<Edit color="status-warning" />} color="status-warning" label="Edit" onClick={() => handleAction("Edit", user)} />
          <IconAction icon={<Trash color="status-critical" />} color="status-critical" label="Delete" onClick={() => handleAction("Delete", user)} />
          <IconAction icon={<More color="brand" />} color="brand" label="More" onClick={() => handleAction("More", user)} />
        </Box>
      ),
    },
  ];

  return (
    <Layer full onEsc={onClose} onClickOutside={onClose} responsive>
      <Box fill background="background" overflow="auto">
        <Box width={{ max: "xlarge" }} fill="horizontal" alignSelf="center" pad={{ horizontal: "large", vertical: "medium" }} gap="large" flex={{ grow: 0, shrink: 0 }}>
          <Box direction="row" justify="between" align="start" gap="medium">
            <Box gap="xsmall">
              <Text size="small" color="brand" weight="bold">GROMMET COMPONENTS</Text>
              <Heading level={1} margin="none">Datadisplay</Heading>
              <Paragraph margin="none" color="dark-3">A responsive user-management view powered by the Mirage users API.</Paragraph>
            </Box>
            <Button icon={<Close />} onClick={onClose} a11yTitle="Close data display demo" />
          </Box>

          <Data
            id="user-management-data"
            data={filteredUsers}
            total={state.users.length}
            filteredTotal={filteredUsers.length}
            view={{ search, sort, page, step: PAGE_SIZE }}
            onView={(view) => {
              if (view.search !== undefined) setSearch(view.search);
              if (view.sort) setSort(view.sort);
              if (view.page) setPage(view.page);
            }}
          >
            <Box background="light-1" pad="medium" gap="medium" round="small">
              <ResponsiveContext.Consumer>
                {(size) => (
                  <Box direction={size === "small" || size === "xsmall" ? "column" : "row"} justify="between" align="start" gap="medium">
                <Box gap="xsmall">
                  <Text size="small" color="brand" weight="bold">USER MANAGEMENT TABLE</Text>
                  <Heading level={2} margin="none">Users</Heading>
                  <Text color="dark-3">Showing name, email, and company from the API response.</Text>
                </Box>
                    <Box direction={size === "small" || size === "xsmall" ? "column" : "row"} gap="small" align="start" flex={{ shrink: 0 }}>
                      <TextInput icon={<FormSearch />} placeholder="Search users" value={search} onChange={handleSearch} aria-label="Search users" />
                      <Button icon={<Refresh />} label="Reload" color="brand" onClick={() => setReload((value) => value + 1)} />
                </Box>
                  </Box>
                )}
              </ResponsiveContext.Consumer>

              {notice && (
                <Box direction="row" justify="between" align="center" pad="small" background="light-2">
                  <Text role="status" aria-live="polite">{notice}</Text>
                  <Button plain label="Dismiss" onClick={() => setNotice("")} />
                </Box>
              )}

              {statusMessage(state) ? (
                <Box pad="large" align="center" gap="small" background="background">
                  <Text color={state.error ? "status-critical" : "dark-3"}>{statusMessage(state)}</Text>
                  {state.error && <Button label="Try again" onClick={() => setReload((value) => value + 1)} />}
                </Box>
              ) : (
                <ResponsiveContext.Consumer>
                  {(size) => size === "small" || size === "xsmall" ? (
                    <Box gap="small">
                      <List data={pageUsers} itemKey="id" primaryKey={(user) => <UserCard user={user} onAction={handleAction} />} />
                    </Box>
                  ) : (
                    <Box overflow="auto" border={{ color: "light-4", size: "small" }}>
                      <DataTable
                        data={pageUsers}
                        columns={columns}
                        primaryKey="id"
                        sort={sort}
                        onSort={handleSort}
                        select={selected}
                        onSelect={(nextSelected) => setSelected(Array.isArray(nextSelected) ? nextSelected : [])}
                        allowSelectAll
                        border={{ color: "light-4", size: "small" }}
                        rowDetails={(user) => (
                          <Box pad="medium" background="light-2" gap="xsmall">
                            <Text weight="bold">Additional details</Text>
                            <Text size="small">Location: {user.details.location}</Text>
                            <Text size="small">Role: {user.details.role}</Text>
                          </Box>
                        )}
                        messages={{ expand: "Show details", collapse: "Hide details" }}
                      />
                    </Box>
                  )}
                </ResponsiveContext.Consumer>
              )}

              {!state.loading && !state.error && filteredUsers.length > 0 && (
                <Pagination numberItems={filteredUsers.length} step={PAGE_SIZE} page={page} onChange={({ page: nextPage }) => setPage(nextPage)} summary />
              )}
            </Box>
          </Data>

          <Accordion>
            <AccordionPanel label="List, ListItem, Card, and table anatomy">
              <Box pad="medium" gap="medium">
                <Text color="dark-3">The table switches to these Card parts on small screens. This preview keeps the responsive card pattern inspectable on desktop too.</Text>
                {pageUsers[0] && <UserCard user={pageUsers[0]} onAction={handleAction} />}
                <List data={["Loading", "Empty", "Error"]}>
                  {(item) => <ListItem><Text>{item} state</Text></ListItem>}
                </List>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell scope="col" border="bottom" pad="small"><Text weight="bold">Component</Text></TableCell>
                      <TableCell scope="col" border="bottom" pad="small"><Text weight="bold">Purpose</Text></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell pad="small">DataTable</TableCell>
                      <TableCell pad="small">Sort, select, and expand user rows</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell pad="small">Card parts</TableCell>
                      <TableCell pad="small">Keep mobile user records readable</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </AccordionPanel>
          </Accordion>
        </Box>
      </Box>
    </Layer>
  );
};

export default Datadisplay;
