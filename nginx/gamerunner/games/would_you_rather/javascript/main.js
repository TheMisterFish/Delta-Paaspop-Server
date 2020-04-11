
document.body.onload = setDeminsions;
document.body.onresize = setDeminsions;

function setDeminsions() {
    let timer_area = document.getElementById("timer_area");

    let direction_areas_top = timer_area.offsetTop + timer_area.offsetHeight;
    let direction_areas_height = direction_areas_bottom - direction_areas_top;
    document.getElementById("left_area").style.height = direction_areas_height + "px";
    document.getElementById("right_area").style.height = direction_areas_height + "px";    
}

toggleFooter();
runGame(30, true)

