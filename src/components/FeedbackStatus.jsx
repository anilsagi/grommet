import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FileInput,
  Heading,
  Layer,
  Meter,
  Notification,
  Spinner,
  Text,
} from "grommet";
import { AnnounceContext } from "grommet";
import { Checkmark, Close, Refresh, StatusCritical } from "grommet-icons";

const ProgressBar = ({ value, max }) => (
  <Box background="light-3" height="12px" round="xsmall" overflow="hidden">
    <Box
      background="brand"
      width={`${Math.min((value / max) * 100, 100)}%`}
      height="12px"
    />
  </Box>
);

const Announcer = ({ announce, message, mode = "polite", role = "log" }) => {
  useEffect(() => {
    if (message) announce(message, mode, 3000);
  }, [announce, message, mode]);

  return (
    <Text align="center" role={role} aria-live={mode}>
      {message || "No new status updates."}
    </Text>
  );
};

const FeedbackStatus = ({ onClose }) => {
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState(2);
  const [announcement, setAnnouncement] = useState({ message: "", mode: "polite" });

  useEffect(() => {
    if (!selectedFile || uploadProgress >= 100) return undefined;

    const timer = window.setInterval(() => {
      setUploadProgress((current) => Math.min(current + 10, 100));
    }, 500);

    return () => window.clearInterval(timer);
  }, [selectedFile, uploadProgress]);

  const showNotification = (status, title, message) => {
    setNotification({ status, title, message });
    setAnnouncement({
      message: `${title}: ${message}`,
      mode: status === "critical" ? "assertive" : "polite",
    });
    console.log(`[FeedbackStatus] ${title}: ${message}`);
  };

  const fetchUsers = async (url, isExpectedToSucceed) => {
    setApiLoading(true);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      const data = await response.json();
      setUsers(data.users || []);
      showNotification("normal", "API success", `${data.users?.length || 0} users loaded from Mirage.`);
    } catch (error) {
      setUsers([]);
      showNotification("critical", "API error", isExpectedToSucceed ? error.message : "The error URL could not be reached.");
    } finally {
      setApiLoading(false);
    }
  };

  const runLoadingState = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      showNotification("normal", "API success", "Your request completed successfully.");
    }, 1200);
  };

  const resetProgress = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setStep(1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadProgress(0);
    showNotification("normal", "Upload started", `${file.name} is uploading.`);
  };

  const advanceStep = () => {
    setStep((current) => Math.min(current + 1, 4));
  };

  return (
    <Layer full onEsc={onClose} onClickOutside={onClose} responsive>
      <Box fill background="background" overflow="auto">
        <Box
          width={{ max: "xlarge" }}
          fill="horizontal"
          alignSelf="center"
          pad="large"
          gap="large"
          flex={{ grow: 0, shrink: 0 }}
        >
          <Box direction="row" justify="between" align="start" gap="medium">
            <Box gap="xsmall">
              <Text size="small" color="brand" weight="bold">GROMMET COMPONENTS</Text>
              <Heading level={1} margin="none">Feedback &amp; status</Heading>
              <Text color="dark-3">Notifications, loading feedback, and progress states.</Text>
            </Box>
            <Button icon={<Close />} onClick={onClose} a11yTitle="Close feedback and status demo" />
          </Box>

          {notification && (
            <Notification
              status={notification.status}
              title={notification.title}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}

          <Box direction="column" gap="large">
            <Box flex={{ basis: "medium" }} gap="small" pad="medium" background="light-1" round="small">
              <Heading level={3} margin="none">Notification</Heading>
              <Text color="dark-3">Show API success and error feedback.</Text>
              <Box direction="row" gap="small" wrap>
                <Button primary label={apiLoading ? "Loading users..." : "Fetch users"} onClick={() => fetchUsers("/api/users", true)} disabled={apiLoading} />
                <Button color="status-critical" label="Test error URL" onClick={() => fetchUsers("/api/invalid-feedback-url", false)} disabled={apiLoading} />
              </Box>
              {users.length > 0 && (
                <Box gap="xxsmall" pad="small" background="background">
                  <Text weight="bold">Loaded users</Text>
                  {users.slice(0, 5).map((user) => (
                    <Text key={user.id} size="small">{user.firstName} {user.lastName} - {user.email}</Text>
                  ))}
                </Box>
              )}
            </Box>

            <Box flex={{ basis: "medium" }} gap="small" pad="medium" background="light-1" round="small">
              <Heading level={3} margin="none">Spinner</Heading>
              <Text color="dark-3">Represent a page loading state.</Text>
              <Box direction="row" align="center" gap="small">
                {loading ? <Spinner message="Loading" /> : <Checkmark color="status-ok" />}
                <Text>{loading ? "Loading page data..." : "Page is ready."}</Text>
              </Box>
              <Box width={{ max: "720px" }}>
                <Button
                  label={loading ? "Loading..." : "Load page"}
                  onClick={runLoadingState}
                  disabled={loading}
                  style={{ width: "100%", maxWidth: "720px" }}
                />
              </Box>
            </Box>
          </Box>

          <Box gap="small" pad="medium" background="light-1" round="small" width={{ max: "medium" }}>
            <Heading level={3} margin="none">Meter and ProgressBar</Heading>
            <Text color="dark-3">Choose a file to track its upload progress.</Text>
            <FileInput
              name="feedback-upload"
              messages={{ dropPrompt: "Drop a file here or choose one" }}
              onChange={handleFileChange}
            />
            <Box gap="small">
              <Box direction="row" justify="between">
                <Text>{selectedFile ? selectedFile.name : "No file selected"}</Text>
                <Text weight="bold">{selectedFile ? `${uploadProgress}%` : "-"}</Text>
              </Box>
              <ProgressBar value={uploadProgress} max={100} />
              <Meter values={[{ value: uploadProgress, color: uploadProgress === 100 ? "status-ok" : "brand" }]} max={100} size="medium" thickness="small" />
            </Box>
            <Box gap="xsmall">
              <Box direction="row" justify="between"><Text>Multi-step progress</Text><Text>{step} of 4</Text></Box>
              <ProgressBar value={step} max={4} />
              <Box direction="row" gap="small" wrap>
                <Button label="Next step" onClick={advanceStep} disabled={step === 4} />
                <Button icon={<Refresh />} label="Reset" onClick={resetProgress} />
              </Box>
            </Box>
          </Box>

          <Box gap="small" pad="medium" background="light-1" round="small">
            <Heading level={3} margin="none">Announce</Heading>
            <Text color="dark-3">Accessible status updates are announced to assistive technology.</Text>
            <Box aria-live="polite" role="status" pad="small" background="light-2">
              <AnnounceContext.Consumer>
                {(announce) => (
                  <Announcer
                    announce={announce}
                    message={announcement.message}
                    mode={announcement.mode}
                    role={announcement.mode === "assertive" ? "alert" : "log"}
                  />
                )}
              </AnnounceContext.Consumer>
            </Box>
            <Button icon={<StatusCritical />} label="Announce error" onClick={() => showNotification("critical", "Validation error", "Please review the highlighted fields.")} />
          </Box>

          <Box gap="small" pad="medium" background="light-1" round="small">
            <Heading level={3} margin="none">Success, error, loading, and empty states</Heading>
            <Box direction="row" gap="small" wrap>
              <Button icon={<Checkmark />} label="Success state" onClick={() => showNotification("normal", "Success", "Everything looks good.")} />
              <Button icon={<StatusCritical />} label="Error state" onClick={() => showNotification("critical", "Error", "Something needs attention.")} />
              <Button label="Loading state" onClick={runLoadingState} disabled={loading} />
            </Box>
            <Box pad="medium" border={{ color: "light-4" }} align="center" gap="small">
              <Text color="dark-3">Empty state: no notifications are waiting.</Text>
              <Button plain label="Clear notification" onClick={() => setNotification(null)} disabled={!notification} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

export default FeedbackStatus;
