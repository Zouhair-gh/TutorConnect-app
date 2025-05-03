import React, { useEffect, useRef, useState } from 'react';
import { CircleCheck, Clock, CalendarX, Award, PieChart, ChevronUp, ChevronDown, Medal } from 'lucide-react';
import * as d3 from 'd3';

const DeliverableStats = ({ deliverables }) => {
    const chartRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Calculate statistics
    const totalAssignments = deliverables.length;
    const submittedCount = deliverables.filter(d => d.isSubmitted).length;
    const pendingCount = deliverables.filter(d => !d.isSubmitted && !d.isPastDeadline).length;
    const lateCount = deliverables.filter(d => !d.isSubmitted && d.isPastDeadline).length;
    const gradedCount = deliverables.filter(d => d.isSubmitted && d.grade !== null).length;

    const submissionRate = totalAssignments > 0 ? (submittedCount / totalAssignments) * 100 : 0;

    // Calculate average grade if there are graded assignments
    let averageGrade = 0;
    let maxPossiblePoints = 0;

    if (gradedCount > 0) {
        const gradedDeliverables = deliverables.filter(d => d.isSubmitted && d.grade !== null);
        const totalGradePoints = gradedDeliverables.reduce((sum, d) => sum + d.grade, 0);
        const totalMaxPoints = gradedDeliverables.reduce((sum, d) => sum + d.maxPoints, 0);

        averageGrade = totalGradePoints / gradedCount;
        maxPossiblePoints = totalMaxPoints / gradedCount;
    }

    // Data for the chart
    const chartData = [
        { name: "Pending", value: pendingCount, color: "#818CF8" },  // indigo
        { name: "Submitted", value: submittedCount - gradedCount, color: "#38BDF8" },  // sky blue
        { name: "Graded", value: gradedCount, color: "#34D399" },  // emerald
        { name: "Late", value: lateCount, color: "#F87171" }  // red
    ];

    // For status indicators
    const statusItems = [
        {
            label: "Pending",
            count: pendingCount,
            percentage: totalAssignments > 0 ? (pendingCount / totalAssignments) * 100 : 0,
            color: "#818CF8",
            bgColor: "bg-indigo-50",
            fillColor: "bg-indigo-500",
            icon: <Clock size={20} className="text-indigo-600" />
        },
        {
            label: "Submitted",
            count: submittedCount - gradedCount,
            percentage: totalAssignments > 0 ? ((submittedCount - gradedCount) / totalAssignments) * 100 : 0,
            color: "#38BDF8",
            bgColor: "bg-sky-50",
            fillColor: "bg-sky-500",
            icon: <CircleCheck size={20} className="text-sky-600" />
        },
        {
            label: "Graded",
            count: gradedCount,
            percentage: totalAssignments > 0 ? (gradedCount / totalAssignments) * 100 : 0,
            color: "#34D399",
            bgColor: "bg-emerald-50",
            fillColor: "bg-emerald-500",
            icon: <Award size={20} className="text-emerald-600" />
        },
        {
            label: "Late",
            count: lateCount,
            percentage: totalAssignments > 0 ? (lateCount / totalAssignments) * 100 : 0,
            color: "#F87171",
            bgColor: "bg-red-50",
            fillColor: "bg-red-500",
            icon: <CalendarX size={20} className="text-red-600" />
        }
    ];

    // Format grade for display
    const formattedGrade = gradedCount > 0
        ? `${averageGrade.toFixed(1)}/${maxPossiblePoints.toFixed(1)}`
        : 'N/A';

    // Grade letter calculation with animation colors
    const getGradeInfo = (grade, max) => {
        if (!grade || !max) return { letter: 'N/A', color: 'text-gray-400', bgColor: 'bg-gray-100' };
        const percentage = (grade / max) * 100;

        if (percentage >= 90) return { letter: 'A', color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-400' };
        if (percentage >= 80) return { letter: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-400' };
        if (percentage >= 70) return { letter: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-400' };
        if (percentage >= 60) return { letter: 'D', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-400' };
        return { letter: 'F', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-400' };
    };

    const gradeInfo = getGradeInfo(averageGrade, maxPossiblePoints);

    // Create D3 chart
    useEffect(() => {
        if (!chartRef.current || chartData.length === 0 || isCollapsed) return;

        const width = chartRef.current.clientWidth;
        const height = 300;
        const radius = Math.min(width, height) / 2.5;

        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        // Create SVG
        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Create pie chart layout
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        // Arc generators
        const arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.9)
            .cornerRadius(4);

        const arcHover = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.95)
            .cornerRadius(4);

        const outerArc = d3.arc()
            .innerRadius(radius * 1.05)
            .outerRadius(radius * 1.05);

        // Create shadow effect
        const shadow = svg.append("defs")
            .append("filter")
            .attr("id", "shadow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        shadow.append("feDropShadow")
            .attr("dx", 0)
            .attr("dy", 1)
            .attr("stdDeviation", 2)
            .attr("flood-opacity", 0.3);

        // Create arcs with animation
        const g = svg.selectAll(".arc")
            .data(pie(chartData.filter(d => d.value > 0)))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("filter", "url(#shadow)");

        // Add hover effect
        g.on("mouseover", function(event, d) {
            d3.select(this)
                .select("path")
                .transition()
                .duration(200)
                .attr("d", arcHover);

            // Show tooltip
            const tooltip = d3.select("#tooltip");
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.name}:</strong> ${d.data.value}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 25}px`);
        })
            .on("mouseout", function() {
                d3.select(this)
                    .select("path")
                    .transition()
                    .duration(200)
                    .attr("d", arc);

                // Hide tooltip
                d3.select("#tooltip").style("opacity", 0);
            });

        // Add tooltip div if not exists
        if (d3.select("#tooltip").empty()) {
            d3.select("body").append("div")
                .attr("id", "tooltip")
                .style("position", "absolute")
                .style("background", "white")
                .style("padding", "6px 10px")
                .style("border-radius", "4px")
                .style("font-size", "12px")
                .style("box-shadow", "0 1px 8px rgba(0,0,0,0.1)")
                .style("pointer-events", "none")
                .style("opacity", 0)
                .style("transition", "opacity 0.15s ease-in-out")
                .style("z-index", 1000);
        }

        // Add paths with animation
        g.append("path")
            .attr("d", arc)
            .style("fill", d => d.data.color)
            .style("stroke", "white")
            .style("stroke-width", 2)
            .transition()
            .duration(800)
            .ease(d3.easeCubicOut)
            .attrTween("d", function(d) {
                const i = d3.interpolate({startAngle: d.startAngle, endAngle: d.startAngle}, d);
                return function(t) {
                    return arc(i(t));
                };
            });

        // Add value labels inside arcs
        g.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .style("opacity", 0)
            .transition()
            .delay(600)
            .duration(400)
            .style("opacity", d => d.data.value > 0 ? 1 : 0)
            .text(d => d.data.value > 0 ? d.data.value : "");

        // Add name labels with lines
        const text = svg.selectAll(".label")
            .data(pie(chartData.filter(d => d.value > 0)))
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("transform", d => {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 1.1 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style("text-anchor", d => {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? "start" : "end");
            })
            .style("font-size", "11px")
            .style("font-weight", "500")
            .style("fill", "#64748b")
            .style("opacity", 0)
            .transition()
            .delay(800)
            .duration(400)
            .style("opacity", 1)
            .text(d => `${d.data.name}`);

        // Add connecting lines
        svg.selectAll(".line")
            .data(pie(chartData.filter(d => d.value > 0)))
            .enter()
            .append("polyline")
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "#cbd5e1")
            .style("stroke-width", 1)
            .style("opacity", 0)
            .attr("points", d => {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 1.1 * (midangle < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos];
            })
            .transition()
            .delay(600)
            .duration(400)
            .style("opacity", 0.7);

        // Add central text
        if (totalAssignments > 0) {
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "-0.5em")
                .style("font-size", "14px")
                .style("fill", "#64748b")
                .text("Total");

            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "1.2em")
                .style("font-size", "24px")
                .style("font-weight", "bold")
                .style("fill", "#334155")
                .text(totalAssignments);
        }
    }, [deliverables, chartData, isCollapsed]);

    // Custom circular progress component
    const CircularProgress = ({ percentage, size = 110, strokeWidth = 6, color, children }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const dash = (percentage * circumference) / 100;

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - dash}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full font-sans">
            {/* Main Statistics Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300">
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <PieChart size={22} className="text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Assignment Dashboard
                        </h3>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-indigo-50 rounded-full px-3 py-1">
                            <span className="text-xs font-semibold text-indigo-700">{totalAssignments} Total Assignments</span>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            {isCollapsed ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronUp size={20} className="text-gray-500" />}
                        </button>
                    </div>
                </div>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-screen'}`}>
                    <div className="p-6">
                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                            {/* Submission Rate */}
                            <div className="lg:col-span-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <CircleCheck size={18} className="text-indigo-600 mr-2" />
                                        <p className="text-sm text-indigo-700 font-medium">Submission Rate</p>
                                    </div>
                                    <h3 className="text-2xl font-bold text-indigo-900 mb-1">{submissionRate.toFixed(0)}%</h3>
                                    <p className="text-xs font-medium text-indigo-600">
                                        {submittedCount} of {totalAssignments} assignments submitted
                                    </p>
                                </div>
                                <CircularProgress percentage={submissionRate} color="#6366f1">
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="text-indigo-700 font-bold text-xl">{submissionRate.toFixed(0)}%</span>
                                    </div>
                                </CircularProgress>
                            </div>

                            {/* Average Grade */}
                            <div className="lg:col-span-3 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-5 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <Medal size={18} className="text-emerald-600 mr-2" />
                                        <p className="text-sm text-emerald-700 font-medium">Average Grade</p>
                                    </div>
                                    <h3 className="text-2xl font-bold text-emerald-900 mb-1">{formattedGrade}</h3>
                                    <p className="text-xs font-medium text-emerald-600">
                                        Based on {gradedCount} graded assignments
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className={`w-16 h-16 rounded-full ${gradeInfo.bgColor} border-3 ${gradeInfo.borderColor} flex items-center justify-center shadow-md`}>
                                        <span className={`text-2xl font-bold ${gradeInfo.color}`}>{gradeInfo.letter}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Counts */}
                            <div className="lg:col-span-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-center mb-4">
                                    <Clock size={18} className="text-gray-600 mr-2" />
                                    <p className="text-sm text-gray-700 font-medium">Assignment Status</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {statusItems.map((item, index) => (
                                        <div key={index} className={`${item.bgColor} rounded-lg p-3 flex flex-col items-center transition-all duration-300 hover:shadow-md`}>
                                            <div className="bg-white bg-opacity-80 p-2 rounded-full shadow-sm mb-2">
                                                {item.icon}
                                            </div>
                                            <h4 className="text-xl font-bold">{item.count}</h4>
                                            <p className="text-xs font-medium mb-1">{item.label}</p>
                                            <div className="w-full bg-white bg-opacity-60 rounded-full h-1.5">
                                                <div
                                                    className={`${item.fillColor} h-1.5 rounded-full`}
                                                    style={{ width: `${item.percentage}%`, transition: 'width 1s ease-in-out' }}>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Chart */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <div className="flex items-center">
                                    <PieChart size={18} className="text-gray-600 mr-2" />
                                    <h4 className="text-base font-medium text-gray-700">Assignment Distribution</h4>
                                </div>
                            </div>
                            <div className="px-5 py-4">
                                <div id="interactive-chart" ref={chartRef} className="w-full h-72"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliverableStats;