const pidCwd = require('pid-cwd');

const setCwd = async (dispatch, pid) => {
    await pidCwd(pid).then(cwd => {
        dispatch({
            type: 'SESSION_SET_CWD',
            cwd,
        });
    });
}

exports.middleware = (store) => (next) => async (action) => {
    switch (action.type) {
        case 'SESSION_REQUEST':
        case 'TERM_GROUP_REQUEST':
            if (store.getState().sessions.activeUid) {
                const { activeUid } = store.getState().sessions;
                const { pid } = store.getState().sessions.sessions[activeUid];
                await setCwd(store.dispatch, pid);   
            }
            break;
        default:
            break;
    }

    next(action);
};

