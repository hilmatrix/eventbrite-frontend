import { API_ORGANIZER_STATISTICS } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import * as d3 from "d3";
import { useEffect, useState } from "react";

export default function OrganizerStatistics() {
  const { getJwtToken } = useAuth();
  const [allTimeStats, setAllTimeStats] = useState({ ticketsSold: 0, revenue: 0 });
  const [monthlyTicketStats, setMonthlyTicketStats] = useState([]);
  const [monthlyRevenueStats, setMonthlyRevenueStats] = useState([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const fetchOrganizerStatistics = async () => {
      try {
        const token = getJwtToken();
        const response = await fetch(`${API_ORGANIZER_STATISTICS}/2024`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          setAllTimeStats({
            ticketsSold: data.tickets_sold_all_time,
            revenue: data.revenue_all_time,
          });

          const ticketStats = Object.values(data.tickets_statistic);
          const revenueStats = Object.values(data.revenue_statistic);

          setMonthlyTicketStats(ticketStats);
          setMonthlyRevenueStats(revenueStats);
          setStatsLoaded(true);
        } else {
          console.log("Failed to fetch organizer statistics");
        }
      } catch (error) {
        console.log("Error fetching organizer statistics:", error);
      }
    };

    fetchOrganizerStatistics();
  }, []);

  useEffect(() => {
    if (statsLoaded) {
      drawChart("#ticket-sales-chart", monthlyTicketStats, "Tickets Sold", "steelblue");
      drawChart("#revenue-chart", monthlyRevenueStats, "Revenue", "seagreen");
    }
  }, [statsLoaded, monthlyTicketStats, monthlyRevenueStats]);

  const drawChart = (chartId, data, label, color) => {
    const svg = d3.select(chartId);
    svg.selectAll("*").remove(); // Clear previous chart
    const margin = { top: 20, right: 30, bottom: 40, left: 100 }; // Doubled the left margin to make room for longer Y-axis labels
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    const svgContainer = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    svgContainer.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svgContainer.append("g")
      .call(d3.axisLeft(y));

    // Add bars
    svgContainer.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(x.domain()[i]))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d))
      .attr("fill", color);
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 my-4 w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">All Time Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-md shadow-sm bg-gray-100">
            <h2 className="text-xl font-semibold mb-2">Total Tickets Sold</h2>
            <p className="text-3xl font-bold">{allTimeStats.ticketsSold}</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm bg-gray-100">
            <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(allTimeStats.revenue)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 my-4 w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Monthly Ticket Sales</h1>
        <svg id="ticket-sales-chart"></svg>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 my-4 w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Monthly Revenue</h1>
        <svg id="revenue-chart"></svg>
      </div>
    </>
  );
}
