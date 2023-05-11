//Sends query response to database
function postQueryResp(queryResult) {
  fetch("http://localhost:3003/queryRespReceiver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ queryResp: queryResult }),
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Sends original response to the database
async function postOriginResp(ogResp, parsedResp, respInfo) {
  const responseObj = {
    alias: respInfo.path.key,
    parentNode: respInfo.fieldName,
    originResp: parsedResp,
    originRespStatus: ogResp.status,
    originRespMessage: ogResp.statusText,
  };


  await fetch("http://localhost:3003/originalRespReceiver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseObj),
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

module.exports = { postQueryResp, postOriginResp };
