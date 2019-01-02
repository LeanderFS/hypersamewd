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
        case 'TERM_GROUP_REQUEST': {
            const { activeUid, sessions } = store.getState().sessions;
            if (activeUid) {
                await setCwd(store.dispatch, sessions[activeUid]);   
            }
            break;
        }
        default:
            break;
    }

    next(action);
};

