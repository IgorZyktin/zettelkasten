/*
    Базовые инструменты рендеринга. Дополнения к тому, что умеет arbor.js.
*/

// смещение экранной системы координат от модельной
let offset = {
    x: 0,
    y: 0
};
let scale = 1; // масштаб

(function ($) {
    let Renderer = function (canvas_id) {
        let canvas_element = $(canvas_id)
        let canvas = canvas_element.get(0)
        let ctx = canvas.getContext("2d");
        let particleSystem = null
        let _mouseP

        let that = {
            init: function (system) {
                particleSystem = system
                particleSystem.screenSize(canvas.width, canvas.height)
                particleSystem.screenPadding(0)
                $(window).resize(that.resize)
                that.resize()
                that.initMouseHandling()
            },

            resize: function () {
                canvas.width = $(window).width();
                canvas.height = $(window).height()
                particleSystem.screenSize(canvas.width, canvas.height)
                that.redraw()
            },

            redraw: function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                particleSystem.eachEdge(function (edge, pt1, pt2) {
                    drawEdge(ctx, edge, pt1, pt2)
                })

                particleSystem.eachNode(function (node, pt) {
                    drawNode(ctx, node, pt)
                })
            },

            initMouseHandling: function () {
                let selected = null;
                let nearest = null;
                let dragged = null;

                let last_x = 0;
                let last_y = 0;

                let handler = {
                    moved: function (e) {
                        let [x, y] = getCursorPosition(canvas, e)
                        let [m_x, m_y] = intoModelCoord(x, y);
                        _mouseP = arbor.Point(m_x, m_y)
                        nearest = particleSystem.nearest(_mouseP);

                        if (!nearest || !nearest.node) return false
                        selected = (nearest.distance < 20 * scale) ? nearest : null
                        return false
                    },
                    clicked: function (e) {
                        let [x, y] = getCursorPosition(canvas, e)
                        let [m_x, m_y] = intoModelCoord(x, y);
                        _mouseP = arbor.Point(m_x, m_y)
                        nearest = dragged = particleSystem.nearest(_mouseP);

                        if (dragged && dragged.node !== null) dragged.node.fixed = true

                        last_x = _mouseP.x;
                        last_y = _mouseP.y;

                        $(canvas).unbind('mousemove', handler.moved);
                        $(canvas).bind('mousemove', handler.dragged)
                        $(window).bind('mouseup', handler.dropped)

                        return false
                    },
                    dragged: function (e) {
                        let [x, y] = getCursorPosition(canvas, e)
                        let [m_x, m_y] = intoModelCoord(x, y);
                        let s = arbor.Point(m_x, m_y)

                        if (!nearest) return
                        if (dragged !== null && dragged.node !== null) {
                            dragged.node.p = particleSystem.fromScreen(s)
                        }
                        return false
                    },

                    dropped: function (e) {
                        if (dragged === null || dragged.node === undefined) return
                        if (dragged.node !== null) dragged.node.fixed = false

                        dragged.node.tempMass = 1000
                        dragged = null;

                        let [x, y] = getCursorPosition(canvas, e)
                        let [m_x, m_y] = intoModelCoord(x, y);

                        let s = arbor.Point(m_x, m_y)
                        let dist = Math.sqrt(
                            Math.abs(last_x - s.x) + Math.abs(last_y - s.y)
                        )

                        if (dist <= 5 * scale) {
                            // срабатывает только если узел почти не таскали,
                            // фактически просто кликнули
                            if (nearest && selected && nearest.node === selected.node) {
                                let link = selected.node.data.link

                                if (link !== undefined) {
                                    window.location = link
                                    return false
                                }
                            }
                        }

                        $(canvas).unbind('mousemove', handler.dragged)
                        $(window).unbind('mouseup', handler.dropped)
                        $(canvas).bind('mousemove', handler.moved);
                        _mouseP = null
                        return false
                    }
                }
                $(canvas).mousedown(handler.clicked);
                $(canvas).mousemove(handler.moved);

            }
        }
        return that
    }

    $(document).ready(function () {
        let sys = arbor.ParticleSystem({
            repulsion: 1000,
            stiffness: 600,
            friction: 0.7,
            gravity: false,
            fps: 55,
            df: 0.02,
            precision: 0.6
        })
        sys.renderer = Renderer('#viewport')

        sys.graft({
            nodes: main_data_block.nodes,
            edges: main_data_block.edges
        });

        function copyText(text) {
            let input = document.createElement('textarea');
            input.innerHTML = text;
            document.body.appendChild(input);
            input.select();
            let result = document.execCommand('copy');
            document.body.removeChild(input);
            return result;
        }

        function extractCoords() {
            // получить координаты результирующего графа
            let coords = {};
            sys.eachNode(function (node, pt) {
                coords[node.data.filename || ''] = {
                    filename: node.data.filename || '',
                    x: pt.x,
                    y: pt.y,
                }
            });
            copyText(JSON.stringify(coords));
        }

        function zoom(e) {
            // обработка колеса мыши
            const canvas = getCanvas();
            let [before_x, before_y] = getCursorPosition(canvas, e)
            let [before_m_x, before_m_y] = intoModelCoord(before_x, before_y);

            let delta = e.deltaY;
            if (delta !== undefined) {
                if (delta > 0) {
                    scale = zoom_smaller(scale);
                } else {
                    scale = zoom_larger(scale);
                }
            }
            let [after_m_x, after_m_y] = intoScreenCoord(before_m_x, before_m_y);
            offset.x += before_x - after_m_x;
            offset.y += before_y - after_m_y;
        }

        const canvas = document.getElementById('viewport');
        canvas.addEventListener('mousewheel', zoom, false);

        // const btn = document.getElementById('btn');
        // btn.addEventListener('click', extractCoords, false);
    });

})(this.jQuery)
