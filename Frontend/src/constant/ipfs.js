const apiKey = "e4d28c2648a2abf9c824";
const apiSecret =
  "039d3a751fd2c65c7f2ef4f2ef71b82af3985517e2373228f258ca3527a82fdd";

export async function uploadStringToIPFS(data) {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  const body = JSON.stringify({ data });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body,
  });

  const result = await response.json();
  return result.IpfsHash; // CID of the stored string
}

export async function getStringFromIPFS(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  const response = await fetch(url);
  const result = await response.json();
  return result.data;
}
