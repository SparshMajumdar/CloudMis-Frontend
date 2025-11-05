export async function fetchAwsScoredData() {
  const res = await fetch("http://localhost:5000/api/aws/fetch-data", {
    credentials: "include",
  });
  return await res.json();
}
