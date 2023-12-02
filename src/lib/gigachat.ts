export async function createUnitsNChapters(title: string, units: string[]) {
    //searchQuery = encodeURIComponent(searchQuery);
    const response = await fetch(
      `http://0.0.0.0:8225/call_gigachat?action=createUnitsNChapters&title=${title}&units=${units}`,
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
    console.log(data);
    return data;
  }