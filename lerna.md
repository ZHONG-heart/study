初始化项目 

``
lerna init
``

添加package

``
lerna create <pkgName>
``

给某个package添加依赖

``
lerna add <moduleName> --scope = <pkgName> 
``

给所有package添加依赖

``
lerna add <moduleName> 
``

所有package更新依赖

``
lerna bootstrap
``

