export const heightSet = (setHeight) => {

    let menuHeight = document.getElementById("menuContent") ? document.getElementById("menuContent").clientHeight : 0
    let headDiv = document.getElementById("headContent") ? document.getElementById("headContent").clientHeight : 0
    let getHeight = parseFloat(headDiv)
    let windowHeight = window.innerHeight
    let setHeightDiv = parseFloat(windowHeight) - (parseFloat(getHeight) + parseFloat(menuHeight) + 70)
    setHeight(setHeightDiv)
}
export const rowBodyHeightSet = (setInnerHeight) => {

    let menuHeight = document.getElementById("menuContent") ? document.getElementById("menuContent").clientHeight : 0
    let headDiv = document.getElementById("headContent") ? document.getElementById("headContent").clientHeight : 0
    let innerHeadDiv= document.getElementById("headerRowObj") ? document.getElementById("headerRowObj").clientHeight : 0
    let getHeight = parseFloat(headDiv) + parseFloat(innerHeadDiv) + parseFloat(menuHeight) + 10
    let windowHeight = window.innerHeight
    let setHeightDiv = parseFloat(windowHeight) - (parseFloat(getHeight) + 30)
    setInnerHeight(setHeightDiv)
}


