/*
    Кастомные инструменты рендеринга
 */


function zoom_smaller(current_scale) {
    // уменьшить масштаб
    if (current_scale > 0.5)
        return current_scale - 0.1
    return 0.5
}


function zoom_larger(current_scale) {
    // увеличить масштаб
    if (current_scale < 3.0)
        return current_scale + 0.1
    return 3.0
}


function getCanvas(element_id = 'viewport') {
    // получить объект, на котором мы рисуем
    return document.getElementById(element_id)
}


function intoScreenCoord(x, y) {
    // преобразовать модельные координаты в экранные
    return [
        Math.round(x * scale + offset.x),
        Math.round(y * scale + offset.y)
    ]
}


function intoModelCoord(x, y) {
    // преобразовать экранные координаты в модельные
    return [
        Math.round((x - offset.x) / scale),
        Math.round((y - offset.y) / scale)
    ]
}


function getCursorPosition(canvas, event) {
    // получить положение курсора в экранных координатах
    const rect = canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top]
}


function drawEdge(ctx, edge, pt1, pt2, scale, offset) {
    // нарисовать одну соединительную линию между блоками
    let [x1, y1] = intoScreenCoord(pt1.x, pt1.y, scale, offset);
    let [x2, y2] = intoScreenCoord(pt2.x, pt2.y, scale, offset);

    ctx.strokeStyle = edge.data.color;
    ctx.lineWidth = edge.data.weight;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function splitToLines(text) {
    // нарезать потенциальный заголовок ноды на строки
    if (text.length > 20)
        return text.split(',')
    return [text]
}


function measureText(ctx, lines, font_size, padding) {
    // замерить какого размера нужен блок под такой текст
    let longest_line = '';
    for (let line of lines) {
        if (line.trim().length > longest_line.length)
            longest_line = line.trim();
    }

    let full_w = ctx.measureText(longest_line).width + padding * 2;
    let full_h = lines.length * font_size + padding * 2;

    return [full_w, full_h]
}


function drawText(ctx, x, y, padding, lines, font_size, fill) {
    // выполнить многострочную надпись
    ctx.font = 'bold ' + font_size + 'px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = fill;

    let full_h = lines.length * font_size;

    for (let [index, line] of lines.entries()) {
        ctx.fillText(
            line.trim(),
            x,
            y - full_h / 2 + index * font_size + font_size  - font_size / 4
        )
    }
}


function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    // функция рендеринга прямоугольника со сглаженными краями
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        let defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();

    if (fill) {
        ctx.fill();
    }

    if (stroke) {
        ctx.stroke();
    }
}


function drawNode(ctx, node, pt) {
    // нарисовать одну ноду
    let padding = 5 * scale;
    let font_size = 16 * scale;
    let radius = 5 * scale;

    ctx.fillStyle = node.data.bg_color;

    let lines = splitToLines(node.data.label || '');
    let [full_w, full_h] = measureText(ctx, lines, font_size, padding)
    let [x, y] = intoScreenCoord(pt.x, pt.y);

    roundRect(
        ctx,
        x - full_w / 2 - padding,
        y - full_h / 2 - padding,
        full_w + padding * 2,
        full_h + padding * 2,
        radius,
        node.data.bg_color,
        2,
        '#000000'
    );

    drawText(ctx, x, y, padding, lines, font_size, '#D7D7D7');
}
