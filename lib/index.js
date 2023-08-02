"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const HoistCommonString = (0, helper_plugin_utils_1.declare)(({ types }) => {
    return {
        name: 'zen',
        visitor: {
            CallExpression(path, state) {
                const { node } = path;
                if (node.callee.name !== 'setTimeout')
                    return;
                const timeNode = node.arguments && node.arguments[1]; // 获取第二个参数的node
                if (!timeNode)
                    return; // 没有第二个参数
                if (timeNode.type === 'NumericLiteral' &&
                    typeof timeNode.value === 'number') {
                    // 变量名。因为相同时间生成的变量名相同，所以会导致同时间都是用同一个变量
                    // const key = 'setTimeout' + timeNode.value + 'ms'
                    const { line, column } = path.node.loc.start;
                    const key = `line${line}column${column}`;
                    state.saveTimeoutMap = state.saveTimeoutMap || {};
                    let mapValue = state.saveTimeoutMap[key];
                    if (!mapValue) {
                        mapValue = { value: timeNode.value, paths: [] };
                        state.saveTimeoutMap[key] = mapValue;
                    }
                    const nodes = mapValue.paths;
                    nodes.push(path);
                }
            },
            Program: {
                // 将在遍历过程的退出阶段被调用
                exit(path, state) {
                    for (const key in state.saveTimeoutMap) {
                        const { value, paths } = state.saveTimeoutMap[key];
                        // 生成标识符（变量）
                        const id = path.scope.generateUidIdentifier(key);
                        // 将节点添加到顶层作用域中
                        path.scope.push({ id, init: types.numericLiteral(value) });
                        // 替换变量
                        paths.forEach((p) => (p.node.arguments[1] = id));
                    }
                },
            },
        },
    };
});
exports.default = HoistCommonString;
//# sourceMappingURL=index.js.map