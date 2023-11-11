import React from 'react';
import { render, waitFor, screen, logRoles} from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock("axios");

const cdata_url = process.env.REACT_APP_CDATA_BASE_URL
const cdata_key = process.env.REACT_APP_CDATA_API_KEY
const wmap_url = process.env.REACT_APP_WMAP_BASE_URL
const wmap_key = process.env.REACT_APP_WMAP_API_KEY

async function getTimeZone() {
  const params = `lat=3.1516964&lon=101.6942371&dt=${Date.now()}`
  const response = await axios.get(`${wmap_url}?${params}&appid=${wmap_key}`);
  return response.timezone;
}

const timezone = {
  "timezone": "Asia/Kuala_Lumpur"
};

test("table test", async () => {
  axios.get.mockResolvedValue(timezone);
  const check = await getTimeZone();
  expect(check).toEqual('Asia/Kuala_Lumpur');
});

async function geometryTest() {
  const v = `Kuala Lumpur, 57000`
  const encodedCode = encodeURIComponent(v);
  const response = await axios.get(`${cdata_url}?q=${encodedCode}&key=${cdata_key}`);
  return response;
}

const geometry = [
  {
    "lat": 3.1516964,
    "lng": 101.6942371
  },
  {
    "lat": 3.1013,
    "lng": 101.6915
  }
];

test("table test", async () => {
  axios.get.mockResolvedValue(geometry);
  const check = await geometryTest();
  const t = check?.map((x) => ({lat: x.lat, lng: x.lng}))
  expect(t).toEqual(geometry);
});