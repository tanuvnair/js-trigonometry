updateSize();

const ctx = myCanvas.getContext("2d");
const chartCtx = chartCanvas.getContext("2d");

const offset = {
    x: myCanvas.width / 2,
    y: myCanvas.height / 2,
};

const chartOffset = {
    x: chartCanvas.width / 2,
    y: chartCanvas.height / 2,
};

let theta = Math.PI / 4;
const c = 100;

const A = {
    x: 0,
    y: 0,
};

const B = {
    x: Math.cos(theta) * c,
    y: Math.sin(theta) * c,
};

const C = {
    x: B.x,
    y: 0,
};

ctx.translate(offset.x, offset.y);
chartCtx.translate(chartOffset.x, chartOffset.y);

drawCoordinateSystem(chartCtx, chartOffset);

update();

document.onwheel = (event) => {
    theta -= toRad(Math.sign(event.deltaY));
    B.x = Math.cos(theta) * c;
    B.y = Math.sin(theta) * c;

    C.x = B.x;

    update();
};

function updateSize() {
    myCanvas.width = window.innerWidth - 20;
    myCanvas.height = window.innerHeight / 1.3;

    chartCanvas.width = window.innerWidth - 20;
    chartCanvas.height = window.innerHeight / 5.6;
}

function update() {
    const c = distance(A, B);
    const a = distance(B, C);
    const b = distance(C, A);

    // S(in) OH -> Opposite/Hypotenuse
    // C(osine) AH -> Adjacent/Hypotenuse
    // T(angent) OA -> Opposite/Adjactent

    // With respect to theta
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const tan = Math.tan(theta);

    const T = {
        x: Math.sign(cos) * Math.hypot(1, tan) * c,
        y: 0,
    };

    ctx.clearRect(-offset.x, -offset.y, myCanvas.width, myCanvas.height);

    drawCoordinateSystem(ctx, offset);

    drawText(
        "sin = " + sin.toFixed(2),
        { x: -offset.x / 2, y: offset.y * 0.7 },
        "red"
    );

    drawText(
        "cos = " + cos.toFixed(2),
        { x: -offset.x / 2, y: offset.y * 0.8 },
        "blue"
    );

    drawText(
        "tan = " + tan.toFixed(2),
        { x: -offset.x / 2, y: offset.y * 0.9 },
        "magenta"
    );
    a;

    drawText(
        "θ = " +
            theta.toFixed(2) +
            " (" +
            Math.round(toDeg(theta)).toString().padStart(2, " ") +
            "°)",
        { x: offset.x / 2, y: offset.y * 0.7 },
        "black"
    );

    drawLine(A, B);
    drawText("1", average(A, B));

    drawLine(B, C, "red");
    drawText("sin", average(B, C), "red");

    drawLine(C, A, "blue");
    drawText("cos", average(C, A), "blue");

    drawLine(B, T, "magenta");
    drawText("tan", average(B, T), "magenta");

    drawText("θ", A);

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.arc(0, 0, c, 0, theta, theta < 0);
    ctx.stroke();

    const chartScaler = chartOffset.y;
    drawPoint(
        {
            x: theta * chartScaler,
            y: sin * chartScaler,
        },
        2,
        "red"
    );
    drawPoint(
        {
            x: theta * chartScaler,
            y: cos * chartScaler,
        },
        2,
        "blue"
    );
    drawPoint(
        {
            x: theta * chartScaler,
            y: tan * chartScaler,
        },
        2,
        "magenta"
    );
}

function toDeg(rad) {
    return (rad * 180) / Math.PI;
}

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

function average(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}

function distance(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function drawCoordinateSystem(ctx, offset) {
    ctx.beginPath();

    // Draw x line
    ctx.moveTo(-offset.x, 0);
    ctx.lineTo(ctx.canvas.width - offset.x, 0);
    // Draw y line
    ctx.moveTo(0, -offset.y);
    ctx.lineTo(0, ctx.canvas.height - offset.y);

    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawText(text, loc, color = "black") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px Courier";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 7;
    ctx.strokeText(text, loc.x, loc.y);
    ctx.fillText(text, loc.x, loc.y);
}

function drawPoint(loc, size = 20, color = "black") {
    chartCtx.beginPath();
    chartCtx.arc(loc.x, loc.y, size / 2, 0, Math.PI * 2); // Math.PI * 2 is a full circle
    chartCtx.fillStyle = color;
    chartCtx.fill();
}

function drawLine(p1, p2, color = "black") {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}