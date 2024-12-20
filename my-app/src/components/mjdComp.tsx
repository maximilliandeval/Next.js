"use client";

import {useState} from "react";

/* 
You're importing a component that needs useState. 
It only works in a Client Component but none of its parents are marked with "use client", so 
they're Server Components by default.
*/
// https://stackoverflow.com/a/76613880/23635722

export default function MjdComp() {

  const [enteredText, setEnteredText] = useState("");

  const [queryResults, setQueryResults] = useState("");

  const handleTexteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredText(event.target.value);
  };

  const searchClicked = () => {
    let url: string = "https://www.reddit.com/user/";
    url = url.concat(enteredText);
    url = url.concat(".json");

    // Example formatted URL for browsing: "https://www.reddit.com/user/yolodeep"
    // Example formatted URL for getting JSON: "https://www.reddit.com/user/yolodeep.json"
    fetchData(url).then(fetchFulfilled, fetchRejected);
  }

  // Documentation: https://www.reddit.com/dev/api/
  // Assumes the Reddit user does have recent activity (T3 or T1)
  const fetchFulfilled = (value: any) => {
    if (value.data != undefined) {
      // value.data.children[0].data.created_utc, but "new Date()" constructor takes ms
      var dt = new Date(value.data.children[0].data.created_utc * 1000);
      setQueryResults(dt.toUTCString() + " (" + value.data.children[0].data.created_utc + ")");
    } else {
      setQueryResults("No data found.");
    }
  }

  const fetchRejected = (value: any) => {
    setQueryResults(value.message);
  }

  return (
    <div>

      {/*        `"` = `&quot;`        */}
      <div>
        <i>Enter a Reddit username and hit &quot;Search&quot; to find the most recent activity for that user.</i>
      </div>

      <span>
          <input type="text" onChange={handleTexteChange} style={{ marginRight: "20px" }} />

          {/* https://www.swyx.io/tailwind-unreset */}
          <button onClick={searchClicked} style={{all: "revert"}}>Search</button>
      </span>

      { (queryResults != "") && 
        <div style={{marginTop: "10px"}}>
          {/*        `'` = `&apos;`        */}
          <p>User&apos;s most recent public activity on Reddit: {queryResults}.</p>
        </div>
      }
    </div>
  );
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function fetchData(url: string) {
  const response = await fetch(url);
  const data = await response.json();

  // https://stackoverflow.com/questions/33445415/javascript-promises-reject-vs-throw
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return data;
}