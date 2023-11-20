"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface ApiEntry {
  API: string;
  Description: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}

const ITEMS_PER_PAGE = 20;

const Home: React.FC = () => {
  const [apiData, setApiData] = useState<ApiEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.publicapis.org/entries");
        setApiData(response.data.entries);
      } catch (error) {
        setError("Error fetching data from the API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentApiData = apiData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1 className="text-2xl font-bold m-1">You Are ON Page:{currentPage}</h1>
      <div className="m-2">
            <Stack spacing={2}>
              <Pagination
                color="primary"
                count={Math.ceil(apiData?.length || 0 / ITEMS_PER_PAGE)}
                page={currentPage}
                onChange={(event, value) => paginate(value)}
              />
            </Stack>
          </div>
      <h1 className="text-4xl bg-slate-300 text-black font-bold p-3">HOME</h1>

      {loading && <p>Loading...</p>}

      {error && <p>Error: {error}</p>}

      {currentApiData && (
        <div className="m-2">
          <ul>
            {currentApiData.map((entry, index) => (
              <li key={index} className="border-2 m-2 border-gray-900">
                <strong className="m-2">{entry.API}</strong>: {entry.Description}
                <div className="m-2">
                  <a
                    className="text-xl font-bold"
                    href={entry.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Iam Link
                  </a>
                </div>
                <div className="m-2">
                <h1>{entry.HTTPS ? "HTTPS Supported" : "No HTTPS Support"}</h1>
                <h1>{entry.Cors}</h1>
                <h1>{entry.Category}</h1>
                </div>
                <hr />
              </li>
            ))}
          </ul>
          
        </div>
      )}
    </div>
  );
};

export default Home;
