const apiKey = import.meta.env.VITE_API_KEY;
const apiSecret = import.meta.env.VITE_SECRET_KEY;


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
