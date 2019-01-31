const pidCwd = require('pid-cwd');

const setCwd = async (dispatch, pid) => {
    await pidCwd(pid).then(cwd => {
        dispatch({
            type: 'SESSION_SET_CWD',
            cwd,
        });
    });
}

let hyperwdConfig;
exports.middleware = ({ getState, dispatch }) => (next) => async (action) => {
    switch (action.type) {
        case 'CONFIG_RELOAD':
        case 'CONFIG_LOAD': {
            hyperwdConfig = action.config.hyperwd || {};
            break;
        }
        case 'SESSION_REQUEST':
        case 'TERM_GROUP_REQUEST': {
            const { activeUid, sessions } = getState().sessions;
            if (activeUid) {
                await setCwd(dispatch, sessions[activeUid].pid);
            }
            break;
        }
        case 'INIT':
            if (hyperwdConfig.initialWorkingDirectory) {
                dispatch({
                    type: 'SESSION_SET_CWD',
                    cwd: hyperwdConfig.initialWorkingDirectory,
                });
            }
            break;
    }
    next(action);
};
