export async function createUnitsNChapters(searchQuery: string) {
    searchQuery = encodeURIComponent(searchQuery);
    console.log(searchQuery)
    const response = await fetch(
      `http://0.0.0.0:8225/search?searchQuery=${searchQuery}&maxResults=1`
    );
  
    // Check if the response is ok
    if (!response.ok) {
      console.log("youtube fail");
      return null;
    }
  
    // Parse the response body as JSON
    const data = await response.json();
  
    // Check if the data is not empty
    if (!data || data.length === 0) {
      console.log("youtube fail");
      return null;
    }
  
    // Extract the first item from the returned list
    return data[0];
  }

export async function call_gigachat(searchQuery: string) {
    searchQuery = encodeURIComponent(searchQuery);
    console.log(searchQuery)
    const response = await fetch(
      `http://0.0.0.0:8225/search?searchQuery=${searchQuery}&maxResults=1`
    );
  
    // Check if the response is ok
    if (!response.ok) {
      console.log("youtube fail");
      return null;
    }
  
    // Parse the response body as JSON
    const data = await response.json();
  
    // Check if the data is not empty
    if (!data || data.length === 0) {
      console.log("youtube fail");
      return null;
    }
  
    // Extract the first item from the returned list
    return data[0];
  }