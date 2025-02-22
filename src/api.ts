import axios from "axios";
export const fhirBaseUrl = "https://hapi.fhir.org/baseR4";

export const fhirApi = axios.create({
  baseURL: fhirBaseUrl,
  headers: {
    "Cache-Control": "no-cache",
  },
});
