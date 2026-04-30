// netlify/functions/discogs-proxy.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const discogsAuthContent = process.env.DISCOGS_AUTH_HEADER_CONTENT;

  const corsHeaders = {
    "Access-Control-Allow-Origin":  "https://oisogs.app",
    "Access-Control-Allow-Headers": "User-Agent, Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (!discogsAuthContent) {
    console.error("DISCOGS_AUTH_HEADER_CONTENT environment variable is not set.");
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Discogs API authentication not configured on the server." }),
    };
  }

  let discogsApiPath = event.path;
  if (discogsApiPath.startsWith("/.netlify/functions/discogs-proxy")) {
    discogsApiPath = discogsApiPath.substring("/.netlify/functions/discogs-proxy".length);
  }
  if (!discogsApiPath || discogsApiPath === "/") {
    discogsApiPath = "/";
  } else if (!discogsApiPath.startsWith("/")) {
    discogsApiPath = "/" + discogsApiPath;
  }

  const queryParams  = event.queryStringParameters || {};
  const queryString  = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join("&");
  const discogsURL   = `https://api.discogs.com${discogsApiPath}${queryString ? `?${queryString}` : ""}`;

  console.log(`Proxying request to: ${discogsURL}`);

  const userAgent = event.headers["user-agent"] || "OisogsAppProxy/1.0 (Netlify Function)";

  // Handle OPTIONS pre-flight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const requestOptions = {
      method: event.httpMethod,
      headers: {
        Authorization: `Discogs ${discogsAuthContent}`,
        "User-Agent":  userAgent,
      },
    };

    if (event.headers["accept"]) {
      requestOptions.headers["Accept"] = event.headers["accept"];
    }
    if (event.body && (event.httpMethod === "POST" || event.httpMethod === "PUT")) {
      requestOptions.body = event.body;
      if (event.headers["content-type"]) {
        requestOptions.headers["Content-Type"] = event.headers["content-type"];
      }
    }

    const response     = await fetch(discogsURL, requestOptions);
    const responseBody = await response.text();

    const responseHeaders = { ...corsHeaders };
    if (response.headers.get("content-type")) {
      responseHeaders["Content-Type"] = response.headers.get("content-type");
    }

    return {
      statusCode: response.status,
      headers:    responseHeaders,
      body:       responseBody,
    };
  } catch (error) {
    console.error("Error proxying to Discogs API:", error);
    return {
      statusCode: 500,
      headers:    { ...corsHeaders, "Content-Type": "application/json" },
      body:       JSON.stringify({ error: "Failed to proxy to Discogs API", details: error.message }),
    };
  }
};
