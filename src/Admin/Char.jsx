// components/ChartsDashboard.jsx
import React from "react";
import Chart from "react-apexcharts";

/* -----------------------
   Helpers
------------------------*/
function parseDate(dateStr) {
  // accept ISO date-like strings; if invalid, return null
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

function formatDateToDDMMYYYY(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return dateStr || "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// function formatVND(value) {
//   if (value === null || value === undefined || isNaN(value)) return "0 đ";
//   return Number(value).toLocaleString("vi-VN") + " đ";
// }

/* -----------------------
   NumberOrder component
   - expects props.chart.orderNumber: [
       { date: "YYYY-MM-DD", counts: { "Xác nhận": n, "Đang giao hàng": n, "Thành Công": n, "Hủy": n, total: n } },
       ...
     ]
------------------------*/
export function NumberOrder({ chart = {} }) {
  const raw = Array.isArray(chart.orderNumber) ? chart.orderNumber : [];

  // sort by date ascending
  const sorted = [...raw].sort((a, b) => {
    const da = parseDate(a?.date);
    const db = parseDate(b?.date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  });

  const xLabels = sorted.map((r) => formatDateToDDMMYYYY(r.date));

  const statusKeys = ["Xác nhận", "Đang giao hàng", "Thành Công", "Hủy"];

  // Color palette (adjust as needed)
const colorMap = {
  total: "#DC2626", // đỏ trầm hơn, đỡ chói mắt
  "Xác nhận": "#2563EB", // xanh dương đậm, nhìn tinh tế
  "Đang giao hàng": "#D97706", // vàng cam vừa, không quá chói
  "Thành Công": "#059669", // xanh lá đậm, dễ nhìn
  Hủy: "#B91C1C", // đỏ đậm, khác hẳn total
};


  // Build series - put total (column) first so lines draw on top visually
  const totalSeries = {
    name: "Tổng số đơn",
    type: "column",
    data: sorted.map((d) => Number(d.counts?.total ?? 0)),
  };

  const statusSeries = statusKeys.map((k) => ({
    name: k,
    type: "line",
    data: sorted.map((d) => Number(d.counts?.[k] ?? 0)),
  }));

  const series = [totalSeries, ...statusSeries];

  // colors aligned with series order
  const colors = [
    colorMap.total,
    colorMap["Xác nhận"],
    colorMap["Đang giao hàng"],
    colorMap["Thành Công"],
    colorMap["Hủy"],
  ];

  // stroke widths & dash for each series (column first => stroke 0)
  const strokeWidths = [0, 3, 3, 3, 3];
  const dashArray = [0, 0, 0, 0, 6]; // dashed for Hủy only

  const options = {
    chart: {
      type: "line",
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: { enabled: true, easing: "easeout", speed: 400 },
    },
    colors,
    stroke: {
      width: strokeWidths,
      curve: "smooth",
      dashArray,
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    fill: {
      opacity: [0.6, 1, 1, 1, 1], // make bars a bit transparent
      type: ["solid", "solid", "solid", "solid", "solid"],
    },
    markers: {
      size: 4,
      hover: { sizeOffset: 2 },
    },
    xaxis: {
      categories: xLabels,
      title: { text: "Ngày" },
      labels: { rotate: 0 },
    },
    yaxis: {
      title: { text: "Số đơn" },
      min: 0,
      labels: {
        formatter: (v) => Math.round(v),
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      offsetY: 8,
      labels: { useSeriesColors: true },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val) => `${val} đơn` },
    },
    grid: { borderColor: "#f1f1f1", strokeDashArray: 4 },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: "70%" } },
          xaxis: { labels: { rotate: -30 } },
        },
      },
    ],
  };

  return <Chart options={options} series={series} type="line" height={420} />;
}

/* -----------------------
   TotalOrder component
   - expects props.chart.revenueChart: [ { date: "YYYY-MM-DD", revenue: number }, ... ]
   - Big centered bold label inside bar formatted as "1.234.000 đ"
------------------------*/

// export function TotalOrder({ chart = {} }) {
//   const raw = Array.isArray(chart.revenueChart) ? chart.revenueChart : [];

//   // sort ascending by date
//   const sorted = [...raw].sort((a, b) => {
//     const da = parseDate(a?.date);
//     const db = parseDate(b?.date);
//     if (!da && !db) return 0;
//     if (!da) return 1;
//     if (!db) return -1;
//     return da - db;
//   });

//   // x labels dd/MM/yyyy
//   const xLabels = sorted.map((r) => formatDateToDDMMYYYY(r.date));
//   const revenues = sorted.map((r) => Number(r.revenue ?? 0));

//   const series = [
//     {
//       name: "Doanh thu (VND)",
//       type: "column",
//       data: revenues,
//     },
//   ];

//   const options = {
//     chart: {
//       type: "bar",
//       stacked: false,
//       toolbar: { show: true },
//       animations: { enabled: true, easing: "easeout", speed: 450 },
//     },
//     colors: ["#25B7FF"], // màu thanh
//     plotOptions: {
//       bar: {
//         columnWidth: "42%",
//         borderRadius: 6,
//         dataLabels: {
//           position: "center", // label ở giữa thanh
//         },
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val) => formatVND(val),
//       offsetY: 0,
//       style: {
//         fontSize: "14px",
//         fontWeight: 700,
//         colors: ["#071b2a"],
//       },
//     },
//     xaxis: {
//       categories: xLabels.length ? xLabels : [formatDateToDDMMYYYY(new Date())],
//       labels: { rotate: -45, style: { fontSize: "12px" } },
//     },
//     yaxis: {
//       title: { text: "Doanh thu (VND)" },
//       labels: {
//         formatter: (val) => Number(val).toLocaleString("vi-VN") + " đ",
//       },
//       min: 0,
//       tickAmount: 5,
//     },
//     tooltip: {
//       y: { formatter: (val) => formatVND(val) },
//     },
//     grid: { borderColor: "#f1f1f1" },
//     legend: { show: false },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: {
//           plotOptions: { bar: { columnWidth: "60%" } },
//           dataLabels: { style: { fontSize: "12px" } },
//           xaxis: { labels: { rotate: -30 } },
//         },
//       },
//       {
//         breakpoint: 480,
//         options: {
//           plotOptions: { bar: { columnWidth: "80%" } },
//           dataLabels: { style: { fontSize: "11px" } },
//         },
//       },
//     ],
//   };

//   return <Chart options={options} series={series} type="bar" height={420} />;
// }


export default { NumberOrder };
