// add your JavaScript/D3 to this file
document.addEventListener('DOMContentLoaded', function() {
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.json("correlation_data.json").then(function(data) {
        console.log("Data loaded:", data);

        data = data.filter(d => d.Correlation !== null && !isNaN(d.Correlation));
        console.log("Filtered data:", data);

        const container = d3.select("#plot");
        
        const width = 800;
        const height = 600;
        const margin = { top: 60, right: 60, bottom: 100, left: 100 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const variables = [...new Set(data.map(d => d.Variable1))];
        console.log("Variables:", variables);

        const xScale = d3.scaleBand()
            .domain(variables)
            .range([0, innerWidth])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(variables)
            .range([0, innerHeight])
            .padding(0.05);

        const colorScale = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(["blue", "white", "red"]);

        console.log("X Scale domain:", xScale.domain());
        console.log("Y Scale domain:", yScale.domain());
        console.log("Color Scale domain:", colorScale.domain());

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.Variable1))
            .attr("y", d => yScale(d.Variable2))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", d => colorScale(d.Correlation))
            .on("mouseover", function(event, d) {
                console.log("Hovered data:", d); // Debug: Log the data on hover
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", "2px");
                
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(`
                    <strong>${d.Variable1}</strong> vs <strong>${d.Variable2}</strong><br/>
                    Correlation: ${d.Correlation.toFixed(2)}
                `)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("stroke", "none");
                
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Correlation Matrix Heatmap");
    }).catch(error => console.error('Error loading the data:', error));
});
