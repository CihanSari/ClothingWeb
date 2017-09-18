/* Main page dispatcher.
*/
requirejs([
    '../js-segment-annotator/js/app/edit',
    '../js-segment-annotator/js/helper/colormap',
    '../js-segment-annotator/js/helper/util'],
    function (page, colormap, util) {
        var dataURL = "data/example.json",  // Change this to another dataset.
            params = util.getQueryParams();

        // Create a colormap for display. The following is an example.
        function createColormap(label, labels) {
            return (label) ?
                colormap.create("single", {
                    size: labels.length,
                    index: labels.indexOf(label)
                }) :
                [[255, 255, 255],
                [226, 196, 196],
                [64, 32, 32]].concat(colormap.create("hsv", {
                    size: labels.length - 3
                }));
        }

        // Load dataset before rendering a view.
        function renderPage(page) {
            util.requestJSON(dataURL, function (data) {
                data.colormap = createColormap(params.label, data.labels);
                page(data, params);
            });
        }
    });
