import { createServer } from "miragejs";

export function makeServer() {
  return createServer({
    logging: true,

    routes() {
      this.get("/api/users", () => {
        console.log("Mirage /api/users route hit");
        return {
          users: [
            {
              id: 1,
              firstName: "Emily",
              lastName: "Johnson",
              email: "emily.johnson@x.dummyjson.com",
              company: "Company A",
            },
            {
              id: 2,
              firstName: "Michael",
              lastName: "Williams",
              email: "michael.williams@x.dummyjson.com",
              company: "Company B",
            },
            {
              id: 3,
              firstName: "Sophia",
              lastName: "Brown",
              email: "sophia.brown@x.dummyjson.com",
              company: "Company C",
            },
            {
              id: 4,
              firstName: "James",
              lastName: "Davis",
              email: "james.davis@x.dummyjson.com",
              company: "Company D",
            },
          ],
        };
      });
    },
  });
}