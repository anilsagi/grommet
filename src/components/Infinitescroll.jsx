import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  InfiniteScroll,
  Layer,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from "grommet";
import { Calendar, Close } from "grommet-icons";

const API_URL = "https://jsonplaceholder.typicode.com/comments";

const MyItem = ({ item }) => (
  <TableRow>
    <TableCell scope="row" size="xsmall">
      <Text weight="bold">{item.id}</Text>
    </TableCell>
    <TableCell size="medium">
      <Text color="brand">{item.email}</Text>
    </TableCell>
    <TableCell size="large">
      <Text>{item.body}</Text>
    </TableCell>
  </TableRow>
);

function Infinitescroll({ renderTrigger }) {
  const [open, setOpen] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || allItems.length) return undefined;

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        setAllItems(await response.json());
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    return undefined;
  }, [open, allItems.length]);

  return (
    <>
      {renderTrigger ? renderTrigger(() => setOpen(true)) : (
        <Button
          margin="small"
          primary
          icon={<Calendar />}
          label="Infinitescroll"
          onClick={() => setOpen(true)}
          a11yTitle="Open infinite comments scroll"
        />
      )}

      {open && (
        <Layer
          onEsc={() => setOpen(false)}
          onClickOutside={() => setOpen(false)}
          responsive
          aria-label="Infinite comments scroll"
        >
          <Box pad="medium" width="large" height="large" gap="medium" background="background">
            <Box direction="row" align="center" justify="between">
              <Heading level={2} margin="none">
                Infinite Scroll 
              </Heading>
              <Heading level={3} margin="none">
                Comments
              </Heading>
              <Button
                icon={<Close />}
                onClick={() => setOpen(false)}
                a11yTitle="Close infinite comments scroll"
              />
            </Box>

            {loading && (
              <Box align="center" justify="center" pad="large" gap="small">
                <Spinner size="medium" />
                <Text color="text-strong">Loading comments...</Text>
              </Box>
            )}

            {error && !loading && (
              <Box pad="medium" background="status-critical" round="small">
                <Text color="white">Error: {error}</Text>
              </Box>
            )}

            {!loading && !error && (
              <Box overflow="auto" flex>
                <Table aria-label="Comments infinite scroll table">
                  <TableHeader>
                    <TableRow>
                      <TableCell scope="col" size="xsmall">
                        <Text weight="bold">ID</Text>
                      </TableCell>
                      <TableCell scope="col" size="medium">
                        <Text weight="bold">Email</Text>
                      </TableCell>
                      <TableCell scope="col" size="large">
                        <Text weight="bold">Comments</Text>
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <InfiniteScroll items={allItems} step={10}>
                      {(item) => <MyItem key={item.id} item={item} />}
                    </InfiniteScroll>
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>
        </Layer>
      )}
    </>
  );
}

export default Infinitescroll;
