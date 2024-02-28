import Container from "@mui/material/Container";
import * as React from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const Statistics = () => {
    const chartIds = [
        "65c861fa-ed77-4061-83b0-b8e3568b41be",
        "65c97d2d-b4b7-45bd-81d8-4d00a6960c7a",
        "65c85671-a7b9-4186-8b75-6964bad620a7",
        "65c85572-e6a0-4974-8024-9319af05853e",
        "65c85410-a7b9-4db6-8042-6964ba8e5a3b",
    ];

    React.useEffect(() => {
        const sdk = new ChartsEmbedSDK({
            baseUrl: "https://charts.mongodb.com/charts-intercambios-hsjlg",
        });

        chartIds.forEach((chartId) => {
            const chart = sdk.createChart({
                chartId: chartId,
                height: "570px",
                width: "100%"
            });
            chart.render(document.getElementById(chartId));
        });
    }, []);

    return (
        <Container component="main" maxWidth="xl"> 
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                {chartIds.map((chartId) => (
                    <div key={chartId} id={chartId} style={{ width: "720px", margin: "10px" }}>
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Statistics;