import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Grommet,
  Heading,
  Text,
  Spinner,
  Data,
  DataContext,
  DataFilters,
  DataSearch,
  DataSort,
  DataSummary,
  DataTable,
  DataTableColumns,
  Toolbar,
  Menu,
  Select,
  Pagination as GrommetPagination,
} from "grommet";

const customTheme = {
  global: {
    font: {
      family: "Helvetica",
    },
  },

  table: {
    body: {
      align: "center",
      pad: {
        horizontal: "large",
        vertical: "xsmall",
      },
      border: "horizontal",
    },

    extend: () => `
      font-family: Arial;
    `,

    header: {
      align: "center",
      border: "bottom",
      fill: "horizontal",
      pad: {
        horizontal: "large",
        vertical: "xsmall",
      },
      verticalAlign: "bottom",

      background: {
        color: "accent-1",
        opacity: "strong",
      },
    },
  },
};
// for proxy url @section 2
// const API_URL = "/api/comments"; 
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/comments`;
console.log("MODE:", import.meta.env.MODE);
console.log("DEV:", import.meta.env.DEV);
console.log("PROD:", import.meta.env.PROD);
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("All VITE variables:", import.meta.env);

// to verify the VITE_ prefix
// console.log("VITE API:", import.meta.env.VITE_API_URL);
// console.log("VITE MESSAGE:", import.meta.env.VITE_PUBLIC_MESSAGE);
// console.log("SECRET:", import.meta.env.VITE_SECRET_MESSAGE);

console.log("MODE:", import.meta.env.MODE);
console.log("API URL:", import.meta.env.VITE_API_URL);



const columns = [
  {
    property: "id",
    header: "ID",
    primary: true,
    sortable: true,
    align: "start",
    size: "xsmall",
  },
  {
    property: "email",
    header: "Email",
    sortable: true,
    align: "start",
    size: "medium",
  },
  {
    property: "body",
    header: "Comments",
    sortable: true,
    align: "start",
    size: "large",
  },
];

const columnOptions = columns.map((column) => ({
  property: column.property,
  label: column.header,
}));

const pageOptions = [10, 20, 30, 50];

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status}`
          );
        }

        const data = await response.json();

        setComments(data);
      } catch (err) {
        setError(
          err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleItemsPerPageChange = ({
    value,
  }) => {
    setItemsPerPage(value);
  };

  return (
    <Grommet theme={customTheme}>
      {/* Loading */}
      {loading && (
        <Box
          align="center"
          justify="center"
          pad="large"
          gap="small"
        >
          <Spinner size="medium" />

          <Text>
            Loading comments...
          </Text>
        </Box>
      )}

      {/* Error */}
      {error && !loading && (
        <Box
          pad="medium"
          margin="medium"
          background={{
            color: {
              dark: "dark-2",
              light: "lightgrey",
            },
            dark: true,
          }}
          round="small"
        >
          <Text>
            Error: {error}
          </Text>
        </Box>
      )}

      {/* Data */}
      {!loading && !error && (
        <Box pad="medium" gap="medium">
          <Heading
            level={2}
            margin="none"
          >
            Comments - HMR test
          </Heading>

          <Data
            id="comments-data"
            data={comments}
            defaultView={{
              page: 1,
              step: itemsPerPage,
            }}
            properties={{
              id: {
                label: "ID",
                search: true,
                sort: true,
                filter: true,
              },

              email: {
                label: "Email",
                search: true,
                sort: true,
                filter: true,
              },

              body: {
                label: "Body",
                search: true,
                sort: true,
                filter: true,
              },
            }}
          >
            {/* Toolbar */}
            <Toolbar gap="medium">
              <Box
                direction="row"
                gap="small"
                flex
              >
                {/* Search */}
                <DataSearch />

                {/* Sort */}
                <DataSort drop />

                {/* Filters */}
                <DataFilters layer />
              </Box>

              {/* Column selector */}
              <DataTableColumns
                options={columnOptions}
                drop
              />

              {/* Actions */}
              <Box
                flex
                align="end"
              >
                <Menu
                  label="Actions"
                  kind="toolbar"
                  items={[
                    {
                      label: "Export as CSV",
                      onClick: () => {
                        console.log(
                          "Export CSV clicked"
                        );
                      },
                    },
                    {
                      label: "Refresh",
                      onClick: () => {
                        window.location.reload();
                      },
                    },
                  ]}
                />
              </Box>
            </Toolbar>

            {/* Summary */}
            <DataSummary />

            {/* Table + Pagination */}
            <ResultsWrapper>
              <DataTable
                aria-label="Comments table"
                columns={columns}
                sortable
                primaryKey="id"
              />

              {/* Pagination */}
              <Pagination
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={
                  handleItemsPerPageChange
                }
              />
            </ResultsWrapper>
          </Data>
        </Box>
      )}
    </Grommet>
  );
}

/*
 * Keeps pagination aligned with the DataTable
 */
const ResultsWrapper = ({
  children,
}) => {
  return (
    <Box align="start">
      <Box
        style={{
          display: "inline-block",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

/*
 * Pagination connected to Grommet DataContext
 */
const Pagination = ({
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const {
    view,
    total,
    filteredTotal,
    setView,
  } = useContext(DataContext);

  const page = view?.page || 1;

  /*
   * When items per page changes,
   * update DataContext instead of
   * maintaining a separate page state.
   */
  const handlePageSizeChange = ({
    value,
  }) => {
    onItemsPerPageChange({
      value,
    });

    setView({
      ...view,
      page: 1,
      step: value,
    });
  };

  /*
   * Number of records currently
   * displayed after search/filter.
   */
  const resultTotal =
    filteredTotal ?? total ?? 0;

  const firstItem =
    resultTotal === 0
      ? 0
      : (page - 1) * itemsPerPage + 1;

  const lastItem =
    Math.min(
      page * itemsPerPage,
      resultTotal
    );

  return (
    <Box
      direction="row"
      align="center"
      justify="between"
      border="top"
      pad={{
        vertical: "small",
        horizontal: "xsmall",
      }}
      gap="medium"
      wrap
    >
      {/* Showing information */}
      <Box
        direction="row"
        align="center"
        gap="small"
      >
        <Text>
          {resultTotal === 0
            ? "Showing 0 items"
            : `Showing ${firstItem}-${lastItem} of ${resultTotal} items`}
        </Text>
      </Box>

      {/* Items per page */}
      <Box
        direction="row"
        align="center"
        gap="small"
      >
        <Text>
          Items per page:
        </Text>

        <Select
          options={pageOptions}
          value={itemsPerPage}
          onChange={handlePageSizeChange}
          size="small"
        />
      </Box>

      {/* Pagination */}
      <GrommetPagination
        numberItems={resultTotal}
        page={page}
        step={itemsPerPage}
        onChange={({ page: newPage }) => {
          setView({
            ...view,
            page: newPage,
            step: itemsPerPage,
          });
        }}
        summary
        aria-label="Comments pagination"
      />
    </Box>
  );
};

export default Comments;