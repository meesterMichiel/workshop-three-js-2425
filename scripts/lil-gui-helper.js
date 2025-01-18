export function createPositionSliders(gui, element, sliderStart, sliderEnd) {
    if(element.position == null) {
        throw new Error("The given element does not have a position attribute.");
    }
    const folder = gui.addFolder(element.name + " position" || 'Position');
    folder.add(element.position, 'x', sliderStart, sliderEnd);
    folder.add(element.position, 'y', sliderStart, sliderEnd);
    folder.add(element.position, 'z', sliderStart, sliderEnd);
    folder.close();
}

export function createRotationSliders(gui, element, sliderStart, sliderEnd) {
    if(element.rotation == null) {
        throw new Error("The given element does not have a rotation attribute.");
    }
    const folder = gui.addFolder(element.name + " rotation" || 'Rotation');
    folder.add(element.rotation, 'x', sliderStart, sliderEnd);
    folder.add(element.rotation, 'y', sliderStart, sliderEnd);
    folder.add(element.rotation, 'z', sliderStart, sliderEnd);
    folder.close();
}

export function createScaleSliders(gui, element, sliderStart, sliderEnd) {
    if(element.scale == null) {
        throw new Error("The given element does not have a scale attribute.");
    }
    const folder = gui.addFolder(element.name + " scale" || 'Scale');
    folder.add(element.scale, 'x', sliderStart, sliderEnd);
    folder.add(element.scale, 'y', sliderStart, sliderEnd);
    folder.add(element.scale, 'z', sliderStart, sliderEnd);
    folder.close();
}