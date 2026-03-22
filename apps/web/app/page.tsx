// import Image from "next/image";

// export default function Home() {
//   return <div>PAge</div>;
// }

"use client";
import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { data } = useSWR("/api/stats", fetcher, {
    refreshInterval: 3000, // poll every 3 seconds
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Job Queue Dashboard</h1>
      {data && (
        <BarChart width={600} height={300} data={data.queues}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="waiting" fill="#7F77DD" />
          <Bar dataKey="active" fill="#1D9E75" />
          <Bar dataKey="failed" fill="#D85A30" />
        </BarChart>
      )}
    </main>
  );
}
