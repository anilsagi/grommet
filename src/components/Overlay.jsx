import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Drop,
  Heading,
  Layer,
  Notification,
  Text,
  TextInput,
  Tip,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import { Close, FormDown, FormNext, Help, More, Trash } from "grommet-icons";

const ModalDialog = ({ title, children, onClose }) => {
  const closeRef = useRef();

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <Layer modal onEsc={onClose} onClickOutside={onClose} responsive>
      <Box width={{ min: "small", max: "medium" }} pad="medium" gap="medium" background="background">
        <Box direction="row" justify="between" align="center" gap="medium">
          <Heading level={2} margin="none">{title}</Heading>
          <Button ref={closeRef} icon={<Close />} a11yTitle={`Close ${title}`} onClick={onClose} />
        </Box>
        {children}
      </Box>
    </Layer>
  );
};

const Overlay = ({ onClose }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [notice, setNotice] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: "Emily Johnson", email: "emily@example.com", status: "Active" },
    { id: 2, name: "Michael Williams", email: "michael@example.com", status: "Pending" },
  ]);
  const [activeUser, setActiveUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);

  const closeModal = () => setActiveModal(null);
  const announce = (status, message) => {
    setNotice({ status, message });
    closeModal();
  };

  const openUserModal = (mode, user = null) => {
    setActiveUser(user);
    setUserName(user?.name || "");
    setUserEmail(user?.email || "");
    setActiveModal(mode);
  };

  const saveUser = () => {
    if (!userName.trim() || !userEmail.trim()) {
      setNotice({ status: "warning", message: "Name and email are required." });
      return;
    }

    if (activeUser) {
      setUsers((current) => current.map((user) => user.id === activeUser.id
        ? { ...user, name: userName.trim(), email: userEmail.trim() }
        : user));
      announce("normal", `${userName.trim()} was updated.`);
      return;
    }

    setUsers((current) => [...current, {
      id: Date.now(),
      name: userName.trim(),
      email: userEmail.trim(),
      status: "Pending",
    }]);
    announce("normal", `${userName.trim()} was created.`);
  };

  const deleteUser = () => {
    if (!activeUser) return;
    setUsers((current) => current.filter((user) => user.id !== activeUser.id));
    announce("critical", `${activeUser.name} was deleted.`);
  };

  return (
    <Layer full onEsc={onClose} onClickOutside={onClose} responsive>
      <Box fill background="background" overflow="auto">
        <Box width={{ max: "xlarge" }} fill="horizontal" alignSelf="center" pad={{ horizontal: "large", vertical: "medium" }} gap="large" flex={{ grow: 0, shrink: 0 }}>
          <Box direction="row" justify="between" align="start" gap="medium">
            <Box gap="xsmall">
              <Text size="small" color="brand" weight="bold">GROMMET COMPONENTS</Text>
              <Heading level={1} margin="none">Overlay</Heading>
              <Text color="dark-3">Accessible layers, drops, tips, and notifications for common user workflows.</Text>
            </Box>
            <Button icon={<Close />} a11yTitle="Close overlay examples" onClick={onClose} />
          </Box>

          {notice && (
            <Notification status={notice.status} message={notice.message} onClose={() => setNotice(null)} />
          )}

          <Box background="light-1" pad="medium" gap="small">
            <Heading level={2} margin="none">Current users</Heading>
            <Text size="small" color="dark-3">This table updates when you create, edit, delete, or change a user status.</Text>
            {users.length > 0 ? (
              <Box overflow="auto">
                <Table aria-label="Current overlay users">
                  <TableHeader>
                    <TableRow>
                      <TableCell scope="col" pad="small"><Text weight="bold">Name</Text></TableCell>
                      <TableCell scope="col" pad="small"><Text weight="bold">Email</Text></TableCell>
                      <TableCell scope="col" pad="small"><Text weight="bold">Status</Text></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell pad="small">{user.name}</TableCell>
                        <TableCell pad="small">{user.email}</TableCell>
                        <TableCell pad="small">{user.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Text color="dark-3">No users available.</Text>
            )}
          </Box>

          <Box direction="row" gap="medium" wrap>
            <Box background="light-1" pad="medium" gap="small" width={{ min: "small", max: "medium" }}>
              <Heading level={3} margin="none">Confirmation modal</Heading>
              <Text color="dark-3">Confirm an action before it changes user data.</Text>
              <Button primary label="Open confirmation" onClick={() => setActiveModal("confirm")} />
            </Box>
            <Box background="light-1" pad="medium" gap="small" width={{ min: "small", max: "medium" }}>
              <Heading level={3} margin="none">Edit-user modal</Heading>
              <Text color="dark-3">Edit a user name inside a focused form layer.</Text>
              <Button label="Edit user" onClick={() => openUserModal("edit", users[0])} />
            </Box>
            <Box background="light-1" pad="medium" gap="small" width={{ min: "small", max: "medium" }}>
              <Heading level={3} margin="none">Delete confirmation</Heading>
              <Text color="dark-3">Use a destructive confirmation before removing a user.</Text>
              <Button color="status-critical" icon={<Trash />} label="Delete user" onClick={() => { setActiveUser(users[0]); setActiveModal("delete"); }} />
            </Box>
          </Box>

          <Box direction="row" gap="medium" wrap>
            <Box background="light-1" pad="medium" gap="small" width={{ min: "small", max: "medium" }}>
              <Heading level={3} margin="none">Dropdown and popover</Heading>
              <Text color="dark-3">Drop positions relative to a target control and closes outside.</Text>
              <Box ref={setDropTarget} align="start" gap="small">
                <Button label="Open actions" icon={<FormDown />} onClick={() => setDropOpen((current) => !current)} aria-expanded={dropOpen} />
                <Button label="Create user" icon={<FormNext />} onClick={() => openUserModal("create")} />
                {dropOpen && (
                  <Drop target={dropTarget} align={{ top: "bottom", left: "left" }} onClickOutside={() => setDropOpen(false)} onEsc={() => setDropOpen(false)}>
                    <Box pad="small" gap="xsmall" background="background" elevation="small">
                      <Button plain label="View profile" icon={<FormNext />} onClick={() => { setNotice({ status: "normal", message: `${users[0]?.name || "User"} profile opened.` }); setDropOpen(false); }} />
                      <Button plain label="Mark active" icon={<More />} onClick={() => { setUsers((current) => current.map((user, index) => index === 0 ? { ...user, status: "Active" } : user)); setNotice({ status: "normal", message: `${users[0]?.name || "User"} is now active.` }); setDropOpen(false); }} />
                    </Box>
                  </Drop>
                )}
              </Box>
            </Box>
            <Box background="light-1" pad="medium" gap="small" width={{ min: "small", max: "medium" }}>
              <Heading level={3} margin="none">Keyboard and focus</Heading>
              <Text color="dark-3">Escape closes every layer. The close button receives focus when a modal opens.</Text>
              <Box align="start" pad={{ bottom: "large" }}>
                <Tip content="Escape closes the current layer." dropProps={{ align: { top: "bottom" } }}>
                  <Button size="small" icon={<Help />} label="Focus help" onClick={() => setNotice({ status: "normal", message: "Focus remains inside the active workflow." })} />
                </Tip>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {activeModal === "confirm" && (
        <ModalDialog title="Confirm changes" onClose={closeModal}>
          <Text>Continue with the pending user update?</Text>
          <Box direction="row" justify="end" gap="small" wrap>
            <Button label="Cancel" onClick={closeModal} />
            <Button primary label="Confirm" onClick={() => announce("normal", "Changes confirmed.")} />
          </Box>
        </ModalDialog>
      )}
      {(activeModal === "edit" || activeModal === "create") && (
        <ModalDialog title={activeModal === "create" ? "Create user" : "Edit user"} onClose={closeModal}>
          <TextInput label="User name" placeholder="Enter full name" value={userName} onChange={(event) => setUserName(event.target.value)} autoFocus />
          <TextInput label="Email" type="email" placeholder="name@example.com" value={userEmail} onChange={(event) => setUserEmail(event.target.value)} />
          <Box direction="row" justify="end" gap="small" wrap>
            <Button label="Cancel" onClick={closeModal} />
            <Button primary label={activeModal === "create" ? "Create user" : "Save user"} onClick={saveUser} />
          </Box>
        </ModalDialog>
      )}
      {activeModal === "delete" && (
        <ModalDialog title="Delete user" onClose={closeModal}>
          <Text>This action removes {activeUser?.name || "this user"} from the current workspace.</Text>
          <Box direction="row" justify="end" gap="small" wrap>
            <Button label="Keep user" onClick={closeModal} />
            <Button color="status-critical" label="Delete" onClick={deleteUser} />
          </Box>
        </ModalDialog>
      )}
    </Layer>
  );
};

export default Overlay;
