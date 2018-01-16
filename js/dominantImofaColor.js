function displayImofaFileList(annotatedFileList, files, fncProgressGenCallback=()=>{}, areaThreshold=0.1, hueGroupThreshold = 30, intGroupThreshold = 0.2, fileStep=1) {
    for (let idxFile = 0; idxFile < annotatedFileList.length; idxFile += fileStep) {
        if (annotatedFileList[idxFile] != null) {
            const idxFiles = annotatedFileList[idxFile].Index;
            function disp(whsi) {
                if (whsi[0] > areaThreshold) {
                    displayByIdx('data/json/' + files[idxFiles], idxFiles, [whsi[1], whsi[2], whsi[3]], fncProgressGenCallback())
                }
            };
            dominantImofaColors(annotatedFileList[idxFile].imofaColor, hueGroupThreshold, intGroupThreshold).forEach(disp);
        }
    }
}

function dominantImofaColors(imofaColors, hueGroupThreshold = 30, intGroupThreshold = 0.2) {
    const imofaHueCenters = [];
    const imofaIntCenters = [];
    for (let idxColor = 0; idxColor < imofaColors.length; idxColor += 1) {
        const [weight, h1, h2, saturation, intensity] = imofaColors[idxColor];
        const hue = getDominantColorFromH1H2SI([h1, h2, saturation, intensity])[0];
        if (checkIfHue(hue, saturation, intensity)) {
            let assignedToACluster = false;
            for (let idxHueCenter = 0; idxHueCenter < imofaHueCenters.length; idxHueCenter += 1) {
                const [centerWeight, centerHue, centerSaturation, centerIntensity] = imofaHueCenters[idxHueCenter];
                let hueDif = (centerHue - hue) % 360;
                while (hueDif < 0) {
                    hueDif += 360;
                }
                // Hue difference should be between 0 and 360 now...
                if (hueDif > (360 - hueGroupThreshold) || hueDif < hueGroupThreshold) {
                    imofaHueCenters[idxHueCenter] = updateCluster(imofaHueCenters[idxHueCenter], [weight, hue, saturation, intensity]);
                    assignedToACluster = true;
                    break;
                }
            }
            if (!assignedToACluster) {
                // Did not assign to any cluster...
                imofaHueCenters.push([weight, hue, saturation, intensity]);
            }
        }
        else {
            let assignedToACluster = false;
            for (let idxIntCenter = 0; idxIntCenter < imofaIntCenters.length; idxIntCenter += 1) {
                const [centerWeight, centerHue, centerSaturation, centerIntensity] = imofaIntCenters[idxIntCenter];
                if (Math.abs(centerIntensity - intensity) < intGroupThreshold) {
                    imofaIntCenters[idxIntCenter] = updateCluster(imofaIntCenters[idxIntCenter], [weight, hue, saturation, intensity]);
                    assignedToACluster = true;
                    break;
                }
            }
            if (!assignedToACluster) {
                // Did not assign to any cluster...
                imofaIntCenters.push([weight, hue, saturation, intensity]);
            }
        }
    }
    return imofaHueCenters.concat(imofaIntCenters);
}