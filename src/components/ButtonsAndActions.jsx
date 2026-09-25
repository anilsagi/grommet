import React, { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  DropButton,
  Heading,
  Layer,
  Menu,
  Text,
  TextInput,
  Tip,
} from "grommet";

import {
  Add,
  Checkmark,
  Close,
  Copy,
  Edit,
  More,
  Trash,
  View,
} from "grommet-icons";

const ButtonsAndActions = ({ onClose }) => {
  // Initial data
  const initialTasks = [
    {
      id: 1,
      name: "Design system",
      owner: "Maya",
      status: "Active",
    },
    {
      id: 2,
      name: "Mobile refresh",
      owner: "Noah",
      status: "Active",
    },
    {
      id: 3,
      name: "Legacy portal",
      owner: "Ava",
      status: "Archived",
    },
  ];
  // State
  const [tasks, setTasks] = useState(initialTasks);

  // Checkbox selected row IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // Row currently being edited
  const [editingId, setEditingId] = useState(null);

  // Temporary values while editing
  const [editValues, setEditValues] = useState({
    name: "",
    owner: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Preview modal
  const [showPreview, setShowPreview] = useState(false);

  // Delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false);

  // Status message
  const [message, setMessage] = useState("");
  // Helpers
  const showMessage = (text) => {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const selectedTask =
    tasks.find((task) => task.id === selectedIds[0]) || null;
  // CHECKBOX SELECTION
  const handleSelect = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      // Single-row selection for this CRUD demo
      return [id];
    });
  };
  // CREATE
  const handleCreate = () => {
    const nextId =
      tasks.length > 0
        ? Math.max(...tasks.map((task) => task.id)) + 1
        : 1;

    const newTask = {
      id: nextId,
      name: "",
      owner: "",
      status: "Draft",
    };

    setTasks((current) => [...current, newTask]);

    // Automatically select and edit the new row
    setSelectedIds([nextId]);
    setEditingId(nextId);

    setEditValues({
      name: "",
      owner: "",
    });

    showMessage("New workspace added. Enter the details.");
  };
  // EDIT
  const handleEdit = () => {
    if (!selectedTask) return;

    setEditingId(selectedTask.id);

    setEditValues({
      name: selectedTask.name,
      owner: selectedTask.owner,
    });
  };
  // INPUT CHANGE
  const handleEditChange = (field, value) => {
    setEditValues((current) => ({
      ...current,
      [field]: value,
    }));
  };
  // SAVE EDIT
  const handleSaveEdit = () => {
    if (!editingId) return;

    if (!editValues.name.trim()) {
      showMessage("Workspace name is required.");
      return;
    }

    if (!editValues.owner.trim()) {
      showMessage("Owner name is required.");
      return;
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === editingId
          ? {
              ...task,
              name: editValues.name.trim(),
              owner: editValues.owner.trim(),
            }
          : task
      )
    );

    setEditingId(null);

    showMessage("Workspace saved successfully.");
  };
  // CANCEL EDIT
  const handleCancelEdit = () => {
    const editingTask = tasks.find(
      (task) => task.id === editingId
    );

    // If this was a newly created empty row,
    // remove it when cancelling.
    if (
      editingTask &&
      !editingTask.name &&
      !editingTask.owner
    ) {
      setTasks((current) =>
        current.filter((task) => task.id !== editingId)
      );

      setSelectedIds([]);
    }

    setEditingId(null);
  };
  // PREVIEW
  const handlePreview = () => {
    if (!selectedTask) return;

    setShowPreview(true);
  };
  // DELETE
  const handleDeleteClick = () => {
    if (!selectedTask) return;

    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (!selectedTask) return;

    const deletedName = selectedTask.name || "Workspace";

    setTasks((current) =>
      current.filter(
        (task) => task.id !== selectedTask.id
      )
    );

    setSelectedIds([]);

    setShowDeleteConfirmation(false);

    showMessage(`${deletedName} deleted successfully.`);
  };
  // DUPLICATE
  const handleDuplicate = () => {
    if (!selectedTask) return;

    const nextId =
      Math.max(...tasks.map((task) => task.id)) + 1;

    const duplicate = {
      ...selectedTask,
      id: nextId,
      name: `${selectedTask.name} Copy`,
      status: "Draft",
    };

    setTasks((current) => [...current, duplicate]);

    setSelectedIds([nextId]);

    showMessage(`${duplicate.name} created.`);
  };
  // ARCHIVE / ACTIVATE
  const handleToggleStatus = () => {
    if (!selectedTask) return;

    const newStatus =
      selectedTask.status === "Archived"
        ? "Active"
        : "Archived";

    setTasks((current) =>
      current.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    showMessage(
      `${selectedTask.name} marked ${newStatus.toLowerCase()}.`
    );
  };
  // LOADING DEMO
  const handleSaveChanges = () => {
    setLoading(true);

    setMessage("Saving changes...");

    window.setTimeout(() => {
      setLoading(false);
      showMessage("Changes saved successfully.");
    }, 1500);
  };
  // MENU
  const menuItems = [
    {
      label: "Edit selected",
      onClick: handleEdit,
    },
    {
      label: "Duplicate selected",
      onClick: handleDuplicate,
    },
    {
      label:
        selectedTask?.status === "Archived"
          ? "Activate selected"
          : "Archive selected",
      onClick: handleToggleStatus,
    },
    {
      label: "Delete selected",
      onClick: handleDeleteClick,
    },
  ];
  // DROP BUTTON
  const actionMenuItems = [
    {
      label: "Edit",
      icon: <Edit size="18" />,
      onClick: handleEdit,
      color: "text-strong",
    },
    {
      label: "Duplicate",
      icon: <Copy size="18" />,
      onClick: handleDuplicate,
      color: "text-strong",
    },
    {
      label:
        selectedTask?.status === "Archived"
          ? "Activate"
          : "Archive",
      icon: <Checkmark size="18" />,
      onClick: handleToggleStatus,
      color: "text-strong",
    },
    {
      label: "Delete",
      icon: <Trash size="18" />,
      onClick: handleDeleteClick,
      color: "status-critical",
    },
  ];

  const dropContent = (
    <Box
      width="220px"
      round="small"
      overflow="hidden"
      background="white"
      border={{
        color: "light-4",
        size: "xsmall",
      }}
      elevation="small"
    >
      <Box
        pad={{ horizontal: "small", vertical: "xsmall" }}
        background="light-2"
        border={{
          side: "bottom",
          color: "light-4",
        }}
      >
        <Text
          weight="bold"
          size="small"
        >
          Row actions
        </Text>

        <Text
          size="small"
          color="dark-3"
        >
          {selectedTask
            ? selectedTask.name || "New workspace"
            : "No selection"}
        </Text>
      </Box>

      <Box pad="xxsmall" gap="xxsmall">
        {actionMenuItems.map((item) => (
          <Button
            key={item.label}
            plain
            onClick={item.onClick}
            alignSelf="stretch"
            style={{
              borderRadius: "8px",
            }}
            hoverIndicator="light-2"
            icon={item.icon}
            label={item.label}
            color={item.color}
            pad={{
              vertical: "xsmall",
              horizontal: "small",
            }}
            justify="start"
          />
        ))}
      </Box>
    </Box>
  );
  // UI
  return (
    <Layer
      full
      onEsc={onClose}
      onClickOutside={onClose}
      responsive
    >
       <Box fill background="background" overflow="auto">
       <Box
      pad="large"
      gap="large"
      width={{ width: "xlarge", max: "100%" }}
      margin="auto"
      flex={{ grow: 0, shrink: 0 }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box direction="row" justify="between" align="start" gap="medium">
      <Box gap="xsmall">
        <Text
          size="small"
          color="brand"
          weight="bold"
        >
          GROMMET COMPONENTS
        </Text>

        <Heading
          level={2}
          margin="none"
        >
          Buttons & Actions
        </Heading>

        <Text color="dark-3">
          Simple CRUD example using Grommet action
          components.
        </Text>
      </Box>
      <Button
        icon={<Close />}
        onClick={onClose}
        a11yTitle="Close buttons and actions demo"
      />
    </Box>

      {/* =====================================================
          CRUD TOOLBAR
      ====================================================== */}

      <Box
        pad="medium"
        background="light-2"
        round="small"
        gap="medium"
      >
        <Box
          direction="row"
          justify="between"
          align="center"
          wrap
          gap="medium"
        >
          <Box gap="xxsmall">
            <Text weight="bold">
              Workspace Manager
            </Text>

            <Text
              size="small"
              color="dark-3"
            >
              {selectedTask
                ? `Selected: ${
                    selectedTask.name ||
                    "New workspace"
                  }`
                : "Select a workspace"}
            </Text>
          </Box>

          <Box
            direction="row"
            gap="small"
            wrap
          >
            {/* CREATE */}

            <Button
              primary
              icon={<Add />}
              label="Create"
              onClick={handleCreate}
              disabled={editingId !== null}
            />

            {/* PREVIEW */}

            <Button
              icon={<View />}
              label="Preview"
              disabled={!selectedTask || editingId !== null}
              onClick={handlePreview}
            />

            {/* DELETE */}

            <Button
              color="status-critical"
              icon={<Trash />}
              label="Delete"
              disabled={!selectedTask || editingId !== null}
              onClick={handleDeleteClick}
            />
          </Box>
        </Box>
      </Box>

      {/* =====================================================
          CRUD TABLE
      ====================================================== */}

      <Box
        border={{
          color: "light-4",
          size: "small",
        }}
        round="small"
        overflow="auto"
      >
        {/* Table header */}

        <Box
          direction="row"
          align="center"
          background="light-2"
          pad="small"
          gap="small"
        >
          <Box width="xsmall">
            <Text weight="bold">
              Select
            </Text>
          </Box>

          <Box
            flex
            basis="medium"
          >
            <Text weight="bold">
              Workspace
            </Text>
          </Box>

          <Box width="medium">
            <Text weight="bold">
              Owner
            </Text>
          </Box>

          <Box width="small">
            <Text weight="bold">
              Status
            </Text>
          </Box>

          <Box width="small">
            <Text weight="bold">
              Action
            </Text>
          </Box>
        </Box>

        {/* Table rows */}

        {tasks.length === 0 ? (
          <Box
            pad="large"
            align="center"
          >
            <Text color="dark-3">
              No workspaces available. Click Create to
              add one.
            </Text>
          </Box>
        ) : (
          tasks.map((task) => {
            const isSelected =
              selectedIds.includes(task.id);

            const isEditing =
              editingId === task.id;

            return (
              <Box
                key={task.id}
                direction="row"
                align="center"
                gap="small"
                pad="small"
                background={
                  isSelected
                    ? "light-3"
                    : "white"
                }
                border={{
                  side: "bottom",
                  color: "light-4",
                }}
              >
                {/* Checkbox */}

                <Box width="xsmall">
                  <CheckBox
                    checked={isSelected}
                    onChange={() =>
                      handleSelect(task.id)
                    }
                    a11yTitle={`Select ${task.name || "workspace"}`}
                  />
                </Box>

                {/* Workspace */}

                <Box
                  flex
                  basis="medium"
                >
                  {isEditing ? (
                    <TextInput
                      value={editValues.name}
                      onChange={(event) =>
                        handleEditChange(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Enter workspace name"
                      autoFocus
                    />
                  ) : (
                    <Text
                      weight={
                        isSelected
                          ? "bold"
                          : "normal"
                      }
                    >
                      {task.name || (
                        <Text color="dark-3">
                          New workspace
                        </Text>
                      )}
                    </Text>
                  )}
                </Box>

                {/* Owner */}

                <Box width="medium">
                  {isEditing ? (
                    <TextInput
                      value={editValues.owner}
                      onChange={(event) =>
                        handleEditChange(
                          "owner",
                          event.target.value
                        )
                      }
                      placeholder="Enter owner"
                    />
                  ) : (
                    <Text>
                      {task.owner || "-"}
                    </Text>
                  )}
                </Box>

                {/* Status */}

                <Box width="small">
                  <Text
                    color={
                      task.status === "Active"
                        ? "status-ok"
                        : task.status === "Archived"
                        ? "dark-3"
                        : "status-warning"
                    }
                  >
                    {task.status}
                  </Text>
                </Box>

                {/* Row actions */}

                <Box
                  width="small"
                  direction="row"
                  gap="xsmall"
                >
                  {isEditing ? (
                    <>
                      <Button
                        icon={<Checkmark />}
                        a11yTitle="Save row"
                        onClick={handleSaveEdit}
                      />

                      <Button
                        icon={<Close />}
                        a11yTitle="Cancel editing"
                        onClick={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <Tip content="Edit this workspace">
                      <Button
                        icon={<Edit />}
                        a11yTitle={`Edit ${
                          task.name ||
                          "workspace"
                        }`}
                        onClick={() => {
                          setSelectedIds([
                            task.id,
                          ]);

                          setEditingId(task.id);

                          setEditValues({
                            name: task.name,
                            owner: task.owner,
                          });
                        }}
                      />
                    </Tip>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* =====================================================
          MENU + DROP BUTTON
      ====================================================== */}

      <Box
        pad="medium"
        gap="medium"
        border={{
          color: "light-4",
          size: "small",
        }}
        round="small"
      >
        <Heading
          level={3}
          margin="none"
        >
          Action menu
        </Heading>

        <Text color="dark-3">
          Select a workspace using the checkbox above,
          then use either action menu.
        </Text>

        <Box
          direction="row"
          gap="medium"
          wrap
        >
          {/* MENU */}

          <Menu
            icon={<More />}
            label="More actions"
            items={menuItems}
            disabled={
              !selectedTask ||
              editingId !== null
            }
          />

          {/* DROP BUTTON */}

          <DropButton
            icon={<More />}
            label="Action options"
            disabled={
              !selectedTask ||
              editingId !== null
            }
            dropAlign={{
              top: "bottom",
              left: "left",
            }}
            dropContent={dropContent}
            dropProps={{
              round: "small",
              elevation: "small",
            }}
            style={{
              border: "2px solid #5b8def",
              borderRadius: "10px",
              minWidth: "160px",
              justifyContent: "space-between",
              padding: "0 12px",
              background: "white",
            }}
          />
        </Box>
      </Box>

          {/* LOADING / DISABLED */}
  

      <Box
        pad="medium"
        gap="medium"
        border={{
          color: "light-4",
          size: "small",
        }}
        round="small"
      >
        <Heading
          level={3}
          margin="none"
        >
          Loading & disabled states
        </Heading>

        <Text color="dark-3">
          Loading simulates an API operation. Disabled
          buttons cannot be activated.
        </Text>

        <Box
          direction="row"
          gap="small"
          wrap
        >
          <Button
            primary
            busy={loading}
            disabled={loading}
            label={
              loading
                ? "Saving..."
                : "Save changes"
            }
            onClick={handleSaveChanges}
          />

          <Button
            label="Disabled action"
            disabled
          />
        </Box>
      </Box>

      {/* =====================================================
          ANCHOR
      ====================================================== */}

      <Box
        pad="medium"
        background="light-1"
        round="small"
        gap="small"
      >
        <Text weight="bold">
          Anchor
        </Text>

        <Text
          size="small"
          color="dark-3"
        >
          Use Anchor for navigation rather than an
          application action.
        </Text>

        <Anchor
          href="https://v2.grommet.io/"
          target="_blank"
          rel="noreferrer"
          label="Open Grommet documentation"
        />
      </Box>

      {/* =====================================================
          TIP
      ====================================================== */}

      <Box
        pad={{ bottom: "large", horizontal: "medium", top: "medium" }}
        gap="small"
        border={{
          color: "light-4",
          size: "small",
        }}
        round="small"
      >
        <Text weight="bold">
          Tip
        </Text>

        <Text
          size="small"
          color="dark-3"
        >
          Hover or focus the button to see contextual
          help.
        </Text>

        <Box align="start">
          <Tip
            content="This demonstrates the Grommet Tip component."
            dropProps={{ align: { top: "bottom" } }}
          >
            <Button
              size="small"
              icon={<Checkmark />}
              label="Hover for help"
              onClick={() =>
                showMessage(
                  "Tip button clicked."
                )
              }
            />
          </Tip>
        </Box>
      </Box>

      {/* =====================================================
          STATUS MESSAGE
      ====================================================== */}

      {message && (
        <Box
          pad="medium"
          background="status-ok"
          round="small"
          direction="row"
          align="center"
          gap="small"
          aria-live="polite"
        >
          <Checkmark />

          <Text weight="bold">
            {message}
          </Text>
        </Box>
      )}

      {/* =====================================================
          PREVIEW MODAL
      ====================================================== */}

      {showPreview && selectedTask && (
        <Layer
          modal
          onEsc={() => setShowPreview(false)}
          onClickOutside={() =>
            setShowPreview(false)
          }
        >
          <Box
            pad="large"
            gap="medium"
            width="medium"
          >
            <Box
              direction="row"
              justify="between"
              align="center"
            >
              <Heading
                level={3}
                margin="none"
              >
                Workspace preview
              </Heading>

              <Button
                icon={<Close />}
                a11yTitle="Close preview"
                onClick={() =>
                  setShowPreview(false)
                }
              />
            </Box>

            <Box
              pad="medium"
              background="light-2"
              round="small"
              gap="small"
            >
              <Text
                size="large"
                weight="bold"
              >
                {selectedTask.name ||
                  "New workspace"}
              </Text>

              <Text>
                Owner: {selectedTask.owner || "-"}
              </Text>

              <Text>
                Status: {selectedTask.status}
              </Text>
            </Box>

            <Box
              direction="row"
              justify="end"
            >
              <Button
                primary
                label="Close"
                onClick={() =>
                  setShowPreview(false)
                }
              />
            </Box>
          </Box>
        </Layer>
      )}

          {/* DELETE CONFIRMATION */}
    
      {showDeleteConfirmation &&
        selectedTask && (
          <Layer
            modal
            onEsc={() =>
              setShowDeleteConfirmation(false)
            }
            onClickOutside={() =>
              setShowDeleteConfirmation(false)
            }
          >
            <Box
              pad="large"
              gap="medium"
              width="medium"
            >
              <Box
                direction="row"
                justify="between"
                align="center"
              >
                <Heading
                  level={3}
                  margin="none"
                >
                  Delete workspace?
                </Heading>

                <Button
                  icon={<Close />}
                  a11yTitle="Close confirmation"
                  onClick={() =>
                    setShowDeleteConfirmation(
                      false
                    )
                  }
                />
              </Box>

              <Text>
                Are you sure you want to delete{" "}
                <Text weight="bold">
                  {selectedTask.name ||
                    "this workspace"}
                </Text>
                ?
              </Text>

              <Text
                size="small"
                color="dark-3"
              >
                This action cannot be undone.
              </Text>

              <Box
                direction="row"
                justify="end"
                gap="small"
              >
                <Button
                  label="Cancel"
                  onClick={() =>
                    setShowDeleteConfirmation(
                      false
                    )
                  }
                />

                <Button
                  primary
                  color="status-critical"
                  icon={<Trash />}
                  label="Confirm delete"
                  onClick={confirmDelete}
                />
              </Box>
            </Box>
          </Layer>
        )}
    </Box>
      </Box>
    </Layer>
  );
};

export default ButtonsAndActions;
