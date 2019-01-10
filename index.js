const pidCwd = require('pid-cwd');

const setCwd = async (dispatch, pid) => {
    await pidCwd(pid).then(cwd => {
        dispatch({
            type: 'SESSION_SET_CWD',
            cwd,
        });
    });
}

let config;
exports.middleware = (store) => (next) => async (action) => {
    switch (action.type) {
        case 'CONFIG_RELOAD':
        case 'CONFIG_LOAD':
            config = action.config.hyperwd || {};
        case 'SESSION_REQUEST':
        case 'TERM_GROUP_REQUEST': {
            const { activeUid, sessions } = store.getState().sessions;
            if (activeUid) {
                await setCwd(store.dispatch, sessions[activeUid].pid);
            }
            break;
        }
        case 'INIT':
            if (config.initialWorkingDirectory) {
                store.dispatch({
                    type: 'SESSION_SET_CWD',
                    cwd: config.initialWorkingDirectory,
                });
            }     
        default:
            break;
    }

    next(action);
};


