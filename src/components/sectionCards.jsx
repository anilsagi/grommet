import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Cards,
  Heading,
  Text,
} from "grommet";
const publicFile = "/demo.txt";
const USER_CARDS_URL = "/api/users";

import sampleFile from "@/assets/sample.txt";
import heroImage from "@/assets/hero.png";
import styles from "./AssetsDemo.module.css";

const SectionCards = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(USER_CARDS_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load users");
        return response.json();
      })
      // .then((payload) => setUsers((payload.users || []).slice(0, 4)))
      .then((payload) => setUsers(payload.users || []))
      .catch((error) => {
        if (error.name !== "AbortError") setUsers([]);
      });

    return () => controller.abort();
  }, []);

  return (
    <Box gap="medium">
      <Box gap="xsmall">
        <Text size="small" color="brand" weight="bold">LIVE USER CARDS</Text>
        <a href="/demo.txt" target="_blank">
  Open Public Asset
</a>
        <Heading level={2} margin="none">Team directory</Heading>
        <Text color="dark-3">Live user data from the Mirage service used by Datadisplay.</Text>
      </Box>
      {users.length > 0 ? (
        <Cards
          id="live-user-cards"
          data={users}
          pad="small"
          columns={{ count: "fit", size: "small" }}
          onOrder={setUsers}
        >
          {(user) => (
            <Card key={user.id} background="light-1" pad="medium" elevation="small">
              <CardBody gap="xsmall">
                <Heading level={3} margin="none" size="small">
                  {user.firstName} {user.lastName}
                </Heading>
                <Text size="small">{user.email}</Text>
                <Text size="small" color="dark-3">
                  {user.company?.name || "Company not provided"}
                </Text>
              </CardBody>
            </Card>
          )}
        </Cards>
      ) : (
        <Box pad="medium" background="light-2">
          <Text>Loading team directory...</Text>
        </Box>
      )}
    </Box>
  );
};

export const AssetsDemo = () => {
  return (
    <div>
      <p>Imported asset: {sampleFile}</p>
      <img src={heroImage} alt="Hero" />
       <h1 className={styles.title}>Assets & CSS</h1>
      <p className={styles.description}>
        This uses CSS Modules.
      </p>
    </div>
  );
};

export default SectionCards;
