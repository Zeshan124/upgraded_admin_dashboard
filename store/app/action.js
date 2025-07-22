export const actionTypes = {
    TOGGLE_DRAWER_MENU: 'TOGGLE_DRAWER_MENU',
    TOGGLE_DRAWER_MENU_SUCCESS: 'TOGGLE_DRAWER_MENU_SUCCESS',

    TOGGLE_DRAWER_WEB_MENU: 'TOGGLE_DRAWER_WEB_MENU',
    TOGGLE_DRAWER_MENU_WEB_SUCCESS: 'TOGGLE_DRAWER_MENU_WEB_SUCCESS',
};

export function toggleDrawerMenu(payload) {
    return { type: actionTypes.TOGGLE_DRAWER_MENU, payload };
}

export function toggleDrawerMenuSuccess(payload) {
    return { type: actionTypes.TOGGLE_DRAWER_MENU_SUCCESS, payload };
}

export function toggleDrawerWebMenu(payload) {
    return { type: actionTypes.TOGGLE_DRAWER_WEB_MENU, payload };
}
export function toggleDrawerMenuWebSuccess(payload) {
    return { type: actionTypes.TOGGLE_DRAWER_MENU_WEB_SUCCESS, payload };
}
