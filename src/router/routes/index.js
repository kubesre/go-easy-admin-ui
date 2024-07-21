const modules = import.meta.glob('./modules/*.ts', { eager: true });
const externalModules = import.meta.glob('./externalModules/*.ts', {
    eager: true,
});
function formatModules(_modules, result) {
    Object.keys(_modules).forEach((key) => {
        const defaultModule = _modules[key].default;
        if (!defaultModule)
            return;
        const moduleList = Array.isArray(defaultModule)
            ? [...defaultModule]
            : [defaultModule];
        result.push(...moduleList);
    });
    return result;
}
export const appRoutes = formatModules(modules, []);
export const appExternalRoutes = formatModules(externalModules, []);
//# sourceMappingURL=index.js.map